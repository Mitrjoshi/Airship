import { indexPageContent } from "@/constants/PageContent";
import { getAWSCredentials } from "./workspaceServices";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { DistFileData } from "@/interface/request";
import {
  S3Client,
  CreateBucketCommand,
  HeadBucketCommand,
  PutBucketWebsiteCommand,
  PutPublicAccessBlockCommand,
  PutBucketPolicyCommand,
  PutObjectCommand,
  GetObjectCommand,
  PutBucketCorsCommand,
  ListObjectsV2Command,
  ListObjectsV2Output,
  _Object,
  DeleteObjectsCommand,
  DeleteBucketCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import {
  CloudFrontClient,
  CreateDistributionCommand,
  CreateDistributionCommandInput,
  CreateInvalidationCommand,
  DeleteDistributionCommand,
  DistributionConfig,
  GetDistributionCommand,
  GetDistributionConfigCommand,
  ListInvalidationsCommand,
  UpdateDistributionCommand,
  ViewerProtocolPolicy,
} from "@aws-sdk/client-cloudfront";

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
    if (!credentials.access_key || !credentials.secret_key) {
      throw new Error("Incomplete AWS credentials found in the database.");
    }

    return {
      accessKeyId: credentials.access_key,
      secretAccessKey: credentials.secret_key,
      region: "",
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
  } catch (error) {
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

// const enableBucketVersioning = async (
//   s3Client: S3Client,
//   bucketName: string
// ) => {
//   const versioningParams = {
//     Bucket: bucketName,
//     VersioningConfiguration: {
//       Status: BucketVersioningStatus.Enabled,
//     },
//   };

//   try {
//     await s3Client.send(new PutBucketVersioningCommand(versioningParams));
//     console.log(`Bucket versioning enabled for ${bucketName}`);
//   } catch (error) {
//     console.error("Error enabling bucket versioning:", error);
//     throw error;
//   }
// };

const createCloudFrontDistribution = async (
  cloudFrontClient: CloudFrontClient,
  bucketName: string,
  region: string
): Promise<{ url: string; id: string } | void> => {
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
        DefaultTTL: 0,
        MaxTTL: 0,
      },
      Comment: "S3 static website with CloudFront HTTPS",
      Enabled: true,
    },
  };

  const { Distribution } = await cloudFrontClient.send(
    new CreateDistributionCommand(cloudFrontParams)
  );

  return {
    url: `https://${Distribution?.DomainName}`,
    id: Distribution?.Id!,
  };
};

export const createStaticWebsite = async (
  bucketName: string,
  workspaceId: string,
  region: string
): Promise<{ url: string; id: string } | void> => {
  try {
    const credentials = await fetchAWSCredentials(workspaceId);
    const s3Client = initializeS3Client({ ...credentials, region });
    const cloudFrontClient = initializeCloudFrontClient({
      ...credentials,
      region,
    });

    await createBucket(s3Client, bucketName);
    await setBucketCors(s3Client, bucketName);
    await enableWebsiteHosting(s3Client, bucketName);
    await disablePublicAccess(s3Client, bucketName);
    await setBucketPolicy(s3Client, bucketName);
    await uploadIndexFile(s3Client, bucketName);
    // await enableBucketVersioning(s3Client, bucketName);

    const cloudFrontUrl = await createCloudFrontDistribution(
      cloudFrontClient,
      bucketName,
      region
    );

    return cloudFrontUrl;
  } catch (error) {
    console.error("Error in createS3Bucket:", error);
    throw error;
  }
};

export const generatePresignedUrls = async (
  workspaceId: string,
  distFiles: DistFileData[],
  bucketName: string,
  region: string
): Promise<{ url: string; path: string }[]> => {
  try {
    const credentials = await fetchAWSCredentials(workspaceId);
    const s3Client = initializeS3Client({ ...credentials, region });
    const presignedURLs = await Promise.all(
      distFiles.map(async (file) => {
        const command = new PutObjectCommand({
          Bucket: bucketName,
          Key: file.path, // Path in S3, keeping folder structure
          ContentType: file.type,
        });
        const signedUrl = await getSignedUrl(s3Client, command, {
          expiresIn: 60,
        });
        return { url: signedUrl, path: file.path };
      })
    );

    return presignedURLs;
  } catch (error) {
    console.error("Error generating pre-signed URLs", error);
    throw new Error("Error generating pre-signed URLs");
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

export const getCloudfrontStatus = async (
  workspaceId: string,
  distributionId: string,
  region: string
) => {
  try {
    // Fetch AWS credentials
    const credentials = await fetchAWSCredentials(workspaceId);

    // Initialize CloudFront client
    const cloudFrontClient = new CloudFrontClient({
      credentials: {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
      },
      region,
    });

    // Fetch Distribution Status
    const distributionCommand = new GetDistributionCommand({
      Id: distributionId,
    });
    const distributionResponse = await cloudFrontClient.send(
      distributionCommand
    );

    const distributionStatus = distributionResponse?.Distribution?.Status;

    // Fetch Invalidation Status
    const invalidationsCommand = new ListInvalidationsCommand({
      DistributionId: distributionId,
    });
    const invalidationsResponse = await cloudFrontClient.send(
      invalidationsCommand
    );

    const invalidationItems =
      invalidationsResponse?.InvalidationList?.Items || [];
    const latestInvalidation = invalidationItems[0];
    const invalidationStatus = latestInvalidation?.Status || "NoInvalidations";

    // Determine overall status
    if (
      distributionStatus === "Deployed" &&
      invalidationStatus === "Completed"
    ) {
      return "Deployed";
    } else if (
      distributionStatus === "InProgress" ||
      invalidationStatus === "InProgress"
    ) {
      return "InProgress";
    } else {
      if (distributionStatus === "Deployed") {
        return "Deployed";
      } else {
        return "InProgress";
      }
    }
  } catch (error) {
    console.error("Error fetching CloudFront status:", error);
    throw error;
  }
};
export const fetchCloudFrontSettings = async (
  workspaceId: string,
  distributionId: string,
  region: string
) => {
  try {
    const credentials = await fetchAWSCredentials(workspaceId);
    const cloudFrontClient = initializeCloudFrontClient({
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      region,
    });
    const command = new GetDistributionConfigCommand({ Id: distributionId });
    const response = await cloudFrontClient.send(command);
    return response?.DistributionConfig;
  } catch (error) {
    console.error("Error fetching CloudFront settings:", error);
    throw error;
  }
};

export const updateCloudFrontSettings = async (
  workspaceId: string,
  distributionId: string,
  region: string,
  settings: DistributionConfig
) => {
  try {
    // Step 1: Fetch credentials
    const credentials = await fetchAWSCredentials(workspaceId);
    const cloudFrontClient = new CloudFrontClient({
      credentials: {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
      },
      region,
    });

    // Step 2: Get the current configuration and ETag
    const getConfigCommand = new GetDistributionConfigCommand({
      Id: distributionId,
    });
    const getConfigResponse = await cloudFrontClient.send(getConfigCommand);

    const { ETag, DistributionConfig } = getConfigResponse;

    if (!ETag) {
      throw new Error(
        "Failed to retrieve the ETag for the distribution configuration."
      );
    }

    // Step 3: Update the distribution configuration
    const updateCommand = new UpdateDistributionCommand({
      Id: distributionId,
      IfMatch: ETag, // Use the ETag to ensure version consistency
      DistributionConfig: settings,
    });

    const response = await cloudFrontClient.send(updateCommand);

    return response?.Distribution;
  } catch (error) {
    console.error("Error updating CloudFront settings:", error);
    throw error;
  }
};

export const createCloudFrontInvalidation = async (
  workspaceId: string,
  distributionId: string,
  region: string,
  path: string
) => {
  try {
    const credentials = await fetchAWSCredentials(workspaceId);
    const cloudFrontClient = initializeCloudFrontClient({
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      region,
    });
    const command = new CreateInvalidationCommand({
      DistributionId: distributionId,
      InvalidationBatch: {
        Paths: { Items: [path], Quantity: 1 },
        CallerReference: Date.now().toString(),
      },
    });
    const response = await cloudFrontClient.send(command);
    return response?.Invalidation;
  } catch (error) {
    console.error("Error invalidating CloudFront:", error);
    throw error;
  }
};

export const getFilesFromS3 = async (
  workspaceId: string,
  bucketName: string,
  region: string
): Promise<_Object[] | undefined> => {
  try {
    const credentials = await fetchAWSCredentials(workspaceId);
    const s3Client = initializeS3Client({ ...credentials, region });
    const command = new ListObjectsV2Command({ Bucket: bucketName });
    const response = await s3Client.send(command);
    return response?.Contents;
  } catch (error) {
    console.error("Error fetching S3 files:", error);
    throw error;
  }
};

export const deleteAllObjectsFromS3 = async (
  workspaceId: string,
  bucketName: string,
  region: string
) => {
  try {
    const credentials = await fetchAWSCredentials(workspaceId);
    const s3Client = initializeS3Client({ ...credentials, region });
    const command = new ListObjectsV2Command({ Bucket: bucketName });
    const response = await s3Client.send(command);
    const keys = response?.Contents?.map((item) => item.Key);
    if (keys && keys.length > 0) {
      const deleteCommand = new DeleteObjectsCommand({
        Bucket: bucketName,
        Delete: { Objects: keys.map((key) => ({ Key: key })) },
      });
      await s3Client.send(deleteCommand);
    }
  } catch (error) {
    console.error("Error deleting S3 objects:", error);
    throw error;
  }
};

export const deleteBucket = async (
  workspaceId: string,
  bucketName: string,
  region: string
) => {
  try {
    // Fetch AWS credentials
    const credentials = await fetchAWSCredentials(workspaceId);
    const s3Client = initializeS3Client({ ...credentials, region });

    // List all objects in the bucket
    const listCommand = new ListObjectsV2Command({ Bucket: bucketName });
    let listResponse = await s3Client.send(listCommand);

    while (listResponse.Contents && listResponse.Contents.length > 0) {
      // Delete each object
      for (const object of listResponse.Contents) {
        if (object.Key) {
          const deleteCommand = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: object.Key,
          });
          await s3Client.send(deleteCommand);
        }
      }

      // Fetch next batch of objects if there are more
      if (listResponse.IsTruncated) {
        listResponse = await s3Client.send(
          new ListObjectsV2Command({
            Bucket: bucketName,
            ContinuationToken: listResponse.NextContinuationToken,
          })
        );
      } else {
        break;
      }
    }

    // Delete the bucket
    const deleteBucketCommand = new DeleteBucketCommand({ Bucket: bucketName });
    await s3Client.send(deleteBucketCommand);

    console.log(`Bucket ${bucketName} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting S3 bucket:", error);
    throw error;
  }
};

export const deleteCloudfrontDistribution = async (
  workspaceId: string,
  distributionId: string,
  region: string
) => {
  try {
    const credentials = await fetchAWSCredentials(workspaceId);
    const cloudFrontClient = initializeCloudFrontClient({
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      region,
    });
    const command = new DeleteDistributionCommand({ Id: distributionId });
    await cloudFrontClient.send(command);
  } catch (error) {}
};
