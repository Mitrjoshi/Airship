import { indexPageContent } from "@/constants/PageContent";
import { getAWSCredentials } from "./workspaceServices";
import {
  S3Client,
  CreateBucketCommand,
  HeadBucketCommand,
  PutBucketWebsiteCommand,
  PutPublicAccessBlockCommand,
  PutBucketPolicyCommand,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import {
  CloudFrontClient,
  CreateDistributionCommand,
  CreateDistributionCommandInput,
  ViewerProtocolPolicy,
} from "@aws-sdk/client-cloudfront";
import { PutBucketCorsCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

interface AWSCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
}

export const fetchAWSCredentials = async (
  workspaceId: string
): Promise<AWSCredentials> => {
  try {
    // Fetch credentials from the database
    const credentials = await getAWSCredentials(workspaceId);

    // Validate that all required fields are present
    if (
      !credentials.access_key ||
      !credentials.secret_key ||
      !credentials.region
    ) {
      throw new Error("Incomplete AWS credentials found in the database.");
    }

    return {
      accessKeyId: credentials.access_key,
      secretAccessKey: credentials.secret_key,
      region: credentials.region,
    };
  } catch (error) {
    console.error("Error fetching AWS credentials:", error);
    throw error;
  }
};

const initializeS3Client = (credentials: AWSCredentials) => {
  return new S3Client({
    credentials: {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
    },
    region: credentials.region,
  });
};

const initializeCloudFrontClient = (credentials: AWSCredentials) => {
  return new CloudFrontClient({
    credentials: {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
    },
    region: credentials.region,
  });
};

const createBucket = async (s3Client: S3Client, bucketName: string) => {
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
  } catch (err: any) {
    if (err.name === "NotFound") {
      await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
    } else {
      throw err;
    }
  }
};

const setBucketCors = async (s3Client: S3Client, bucketName: string) => {
  const corsConfiguration = {
    Bucket: bucketName,
    CORSConfiguration: {
      CORSRules: [
        {
          AllowedHeaders: ["*"],
          AllowedMethods: ["GET", "PUT", "POST"],
          AllowedOrigins: ["*"], // Replace with specific origins if needed
          ExposeHeaders: [],
          MaxAgeSeconds: 3000, // Optional: Cache time for the preflight response
        },
      ],
    },
  };

  try {
    await s3Client.send(new PutBucketCorsCommand(corsConfiguration));
    console.log("CORS configuration successfully set for the bucket");
  } catch (error) {
    console.error("Error setting CORS configuration:", error);
    throw error;
  }
};

const enableWebsiteHosting = async (s3Client: S3Client, bucketName: string) => {
  const websiteParams = {
    Bucket: bucketName,
    WebsiteConfiguration: {
      IndexDocument: { Suffix: "index.html" },
      ErrorDocument: { Key: "error.html" },
    },
  };
  await s3Client.send(new PutBucketWebsiteCommand(websiteParams));
};

const disablePublicAccess = async (s3Client: S3Client, bucketName: string) => {
  await s3Client.send(
    new PutPublicAccessBlockCommand({
      Bucket: bucketName,
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: false,
        IgnorePublicAcls: false,
        BlockPublicPolicy: false,
        RestrictPublicBuckets: false,
      },
    })
  );
};

const setBucketPolicy = async (s3Client: S3Client, bucketName: string) => {
  const bucketPolicy = {
    Version: "2012-10-17",
    Statement: [
      {
        Sid: "PublicReadGetObject",
        Effect: "Allow",
        Principal: "*",
        Action: ["s3:GetObject", "s3:PutObject"],
        Resource: `arn:aws:s3:::${bucketName}/*`,
      },
    ],
  };

  await s3Client.send(
    new PutBucketPolicyCommand({
      Bucket: bucketName,
      Policy: JSON.stringify(bucketPolicy),
    })
  );
};

const uploadIndexFile = async (s3Client: S3Client, bucketName: string) => {
  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: "index.html",
      Body: indexPageContent,
      ContentType: "text/html",
    })
  );
};

const createCloudFrontDistribution = async (
  cloudFrontClient: CloudFrontClient,
  bucketName: string,
  region: string
): Promise<string | undefined> => {
  const cloudFrontParams: CreateDistributionCommandInput = {
    DistributionConfig: {
      CallerReference: `${Date.now()}`,
      Origins: {
        Quantity: 1,
        Items: [
          {
            Id: bucketName,
            DomainName: `${bucketName}.s3.${region}.amazonaws.com`,
            S3OriginConfig: { OriginAccessIdentity: "" },
          },
        ],
      },
      DefaultRootObject: "index.html",
      DefaultCacheBehavior: {
        TargetOriginId: bucketName,
        ViewerProtocolPolicy: ViewerProtocolPolicy.redirect_to_https,
        AllowedMethods: { Quantity: 2, Items: ["GET", "HEAD"] },
        ForwardedValues: {
          QueryString: false,
          Cookies: { Forward: "none" },
        },
        MinTTL: 0,
      },
      Comment: "S3 static website with CloudFront HTTPS",
      Enabled: true,
    },
  };

  const { Distribution } = await cloudFrontClient.send(
    new CreateDistributionCommand(cloudFrontParams)
  );

  return Distribution ? `https://${Distribution.DomainName}/` : undefined;
};

export const createStaticWebsite = async (
  bucketName: string,
  workspaceId: string
): Promise<string | undefined> => {
  try {
    const credentials = await fetchAWSCredentials(workspaceId);
    const s3Client = initializeS3Client(credentials);
    const cloudFrontClient = initializeCloudFrontClient(credentials);

    await createBucket(s3Client, bucketName);
    await setBucketCors(s3Client, bucketName);
    await enableWebsiteHosting(s3Client, bucketName);
    await disablePublicAccess(s3Client, bucketName);
    await setBucketPolicy(s3Client, bucketName);
    await uploadIndexFile(s3Client, bucketName);

    const cloudFrontUrl = await createCloudFrontDistribution(
      cloudFrontClient,
      bucketName,
      credentials.region
    );

    return cloudFrontUrl;
  } catch (error) {
    console.error("Error in createS3Bucket:", error);
    throw error;
  }
};

export const createSignedUrls = async (
  bucketName: string,
  workspaceId: string,
  filesKeys: string[] // Now these keys represent file paths
) => {
  try {
    const credentials = await fetchAWSCredentials(workspaceId);
    const s3Client = initializeS3Client(credentials);

    // Step 1: List existing files in the bucket
    try {
      const listCommand = new ListObjectsV2Command({ Bucket: bucketName });
      const listResponse = await s3Client.send(listCommand);

      if (listResponse.Contents && listResponse.Contents.length > 0) {
        // Step 2: Delete existing files
        const deleteCommand = new DeleteObjectsCommand({
          Bucket: bucketName,
          Delete: {
            Objects: listResponse.Contents.map((item) => ({ Key: item.Key! })),
          },
        });
        await s3Client.send(deleteCommand);
        console.log("Existing files deleted successfully.");
      } else {
        console.log("No files to delete in the bucket.");
      }
    } catch (listOrDeleteError) {
      console.error("Error listing or deleting files:", listOrDeleteError);
      throw new Error("Failed to list or delete existing files in the bucket");
    }

    // Step 3: Generate signed URLs for multiple files with full paths
    const signedUrls: { [key: string]: string } = {};
    try {
      for (const key of Array.from(filesKeys)) {
        const putCommand = new PutObjectCommand({
          Bucket: bucketName,
          Key: key, // Use full path as the key
          ContentType: "application/octet-stream", // Adjust as needed
        });
        const signedUrl = await getSignedUrl(s3Client, putCommand, {
          expiresIn: 3600,
        });
        signedUrls[key] = signedUrl;
      }
      console.log("Signed URLs generated successfully.");
    } catch (urlGenerationError) {
      console.error("Error generating signed URLs:", urlGenerationError);
      throw new Error("Failed to generate signed URLs");
    }

    return signedUrls;
  } catch (error) {
    console.error("Error handling S3 operations:", error);
    throw new Error("Failed to handle S3 operations");
  }
};

export const uploadFiles = async (
  bucketName: string,
  workspaceId: string,
  files: File[]
) => {
  try {
    const credentials = await fetchAWSCredentials(workspaceId);
    const s3Client = initializeS3Client(credentials);

    const uploadPromises = files.map((file) => {
      const params = {
        Bucket: bucketName,
        Key: file.name,
        Body: file,
      };

      return s3Client.send(new PutObjectCommand(params));
    });

    const uploadResults = await Promise.all(uploadPromises);
    return uploadResults;
  } catch (error) {
    console.error("Error uploading files: ", error);
    throw new Error("Failed to upload files");
  }
};
