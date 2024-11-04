import { getAWSCredentials } from "./workspaceServices";
import AWS from "aws-sdk";

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

export const createS3Bucket = async (
  bucketName: string,
  workspaceId: string
): Promise<void> => {
  try {
    // Fetch AWS credentials dynamically
    const { accessKeyId, secretAccessKey, region } = await fetchAWSCredentials(
      workspaceId
    );

    // Initialize the S3 client with the fetched credentials
    const s3 = new AWS.S3({
      accessKeyId,
      secretAccessKey,
      region,
    });

    // Check if the bucket already exists
    try {
      await s3.headBucket({ Bucket: bucketName }).promise();
      console.log(`Bucket "${bucketName}" already exists.`);
    } catch (err: any) {
      if (err.statusCode === 404) {
        // Step 1: Create the bucket
        await s3
          .createBucket({
            Bucket: bucketName,
          })
          .promise();
        console.log(`Bucket "${bucketName}" created successfully.`);

        // Step 2: Enable website hosting on the bucket
        const websiteParams = {
          Bucket: bucketName,
          WebsiteConfiguration: {
            IndexDocument: {
              Suffix: "index.html", // Entry point for the website
            },
            ErrorDocument: {
              Key: "error.html", // Error page for the website
            },
          },
        };
        await s3.putBucketWebsite(websiteParams).promise();
        console.log(`Website hosting enabled for bucket "${bucketName}".`);

        // Step 2.1: Disable Block Public Access
        await s3
          .putPublicAccessBlock({
            Bucket: bucketName,
            PublicAccessBlockConfiguration: {
              BlockPublicAcls: false,
              IgnorePublicAcls: false,
              BlockPublicPolicy: false,
              RestrictPublicBuckets: false,
            },
          })
          .promise();
        console.log(`Public access block disabled for bucket "${bucketName}".`);

        // Step 3: Set bucket policy to allow public access (optional, only if public access is needed)
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

        const policyParams = {
          Bucket: bucketName,
          Policy: JSON.stringify(bucketPolicy),
        };

        await s3.putBucketPolicy(policyParams).promise();
        console.log(`Public access policy set for bucket "${bucketName}".`);
      } else {
        throw err; // Rethrow if it's not a "not found" error
      }
    }
  } catch (error) {
    console.error("Error in createS3Bucket:", error);
    throw error;
  }
};
