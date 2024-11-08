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
} from "@aws-sdk/client-s3";
import {
  CloudFrontClient,
  CreateDistributionCommand,
  CreateDistributionCommandInput,
  ViewerProtocolPolicy,
} from "@aws-sdk/client-cloudfront";
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
  console.log("Credentials:", credentials);

  return new S3Client({
    credentials: {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
    },
    region: credentials.region,
    endpoint: `https://s3.${credentials.region}.amazonaws.com`,
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
        Action: "s3:GetObject",
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

export const createSignedUrl = async (
  bucketName: string,
  workspaceId: string
) => {
  try {
    const credentials = await fetchAWSCredentials(workspaceId);
    const s3Client = initializeS3Client(credentials);
    const command = new GetObjectCommand({ Bucket: bucketName, Key: "/" });
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    return signedUrl;
  } catch (error) {
    throw new Error("Failed to generate signed URL");
  }
};
