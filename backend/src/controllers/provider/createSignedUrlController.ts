import { DistFileData } from "@/interface/request";
import {
  createSignedUrl,
  deleteAllObjectsFromS3,
  generatePresignedUrls,
} from "@/services/AWSServices";
import { createResponse } from "@/utils/createResponse";
import { Request, Response } from "express";

interface GetPresignedUrlsRequest {
  bucketName: string;
  workspaceId: string;
  distFiles: DistFileData[];
  region: string;
}

export const getPresignedUrlsController = async (
  req: Request<{}, {}, GetPresignedUrlsRequest>,
  res: Response
): Promise<void> => {
  const { workspaceId, bucketName, distFiles, region } = req.body;

  try {
    const presignedURLs = await generatePresignedUrls(
      workspaceId,
      distFiles,
      bucketName,
      region
    );

    await deleteAllObjectsFromS3(workspaceId, bucketName, region);

    res
      .status(200)
      .send(
        createResponse(true, "Signed Url created successfully.", presignedURLs)
      );
  } catch (error) {
    res.status(500).send(
      createResponse(false, "An unexpected error occurred.", null, {
        message: (error as Error).message,
      })
    );
  }
};
