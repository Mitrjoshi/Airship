import {
  createCloudFrontInvalidation,
  getFilesFromS3,
} from "@/services/AWSServices";
import { createResponse } from "@/utils/createResponse";
import { Request, Response } from "express";

interface getS3FilesRequest {
  workspaceId: string;
  bucketName: string;
  region: string;
}

export const getS3Files = async (
  req: Request<{}, {}, getS3FilesRequest>,
  res: Response
): Promise<void> => {
  const { workspaceId, bucketName, region } = req.body;

  try {
    const filesFetched = await getFilesFromS3(workspaceId, bucketName, region);

    if (!filesFetched) {
      res
        .status(500)
        .send(createResponse(false, "An unexpected error occurred.", null));
      return;
    }

    const newFiles = filesFetched.map((item) => {
      const url = `https://${bucketName}.s3.${region}.amazonaws.com/${item.Key}`;
      return { ...item, url };
    });

    res
      .status(200)
      .send(
        createResponse(true, "Invalidation created successfully.", newFiles)
      );
  } catch (error) {
    res.status(500).send(
      createResponse(false, "An unexpected error occurred.", null, {
        message: (error as Error).message,
      })
    );
  }
};
