import { indexPageContent } from "@/constants/PageContent";
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
): Promise<string | undefined> => {
  try {
    // Fetch AWS credentials for the specific workspace
    const { accessKeyId, secretAccessKey, region } = await fetchAWSCredentials(
      workspaceId
    );

    // Initialize the S3 client with the fetched credentials
    const s3 = new AWS.S3({
      accessKeyId,
      secretAccessKey,
      region,
    });

    const cloudfront = new AWS.CloudFront({
      accessKeyId,
      secretAccessKey,
      region,
    });

    try {
      await s3.headBucket({ Bucket: bucketName }).promise();
    } catch (err: any) {
      if (err.statusCode === 404) {
        // Step 1: Create the bucket
        await s3
          .createBucket({
            Bucket: bucketName,
          })
          .promise();

        // Step 2: Enable website hosting on the bucket
        const websiteParams = {
          Bucket: bucketName,
          WebsiteConfiguration: {
            IndexDocument: {
              Suffix: "index.html",
            },
            ErrorDocument: {
              Key: "error.html",
            },
          },
        };
        await s3.putBucketWebsite(websiteParams).promise();

        // Step 3: Disable Block Public Access
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

        // Step 4: Set bucket policy to allow public access to objects
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

        await s3
          .putBucketPolicy({
            Bucket: bucketName,
            Policy: JSON.stringify(bucketPolicy),
          })
          .promise();

        // Step 5: Upload an index.html file
        await s3
          .putObject({
            Bucket: bucketName,
            Key: "index.html",
            Body: indexPageContent,
            ContentType: "text/html",
          })
          .promise();

        // Step 6: Create CloudFront distribution
        const cloudFrontParams = {
          DistributionConfig: {
            CallerReference: `${Date.now()}`, // unique identifier
            Origins: {
              Quantity: 1,
              Items: [
                {
                  Id: bucketName,
                  DomainName: `${bucketName}.s3.${region}.amazonaws.com`, // Direct S3 bucket endpoint
                  S3OriginConfig: {
                    OriginAccessIdentity: "", // Empty if public access is allowed; use Origin Access Identity if restricted
                  },
                },
              ],
            },
            DefaultRootObject: "index.html", // Set default root object
            DefaultCacheBehavior: {
              TargetOriginId: bucketName,
              ViewerProtocolPolicy: "redirect-to-https",
              AllowedMethods: {
                Quantity: 2,
                Items: ["GET", "HEAD"],
              },
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

        const { Distribution } = await cloudfront
          .createDistribution(cloudFrontParams)
          .promise();
        const cloudFrontUrl = `https://${Distribution?.DomainName}/`;

        // Return the CloudFront URL
        return cloudFrontUrl;
      } else {
        throw err;
      }
    }
  } catch (error) {
    console.error("Error in createS3Bucket:", error);
    throw error;
  }
};
