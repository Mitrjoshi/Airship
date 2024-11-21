import { DistFileData } from "@/interface/request";
import {
  createSignedUrl,
  generatePresignedUrls,
  updateCloudFrontSettings,
} from "@/services/AWSServices";
import { createResponse } from "@/utils/createResponse";
import { DistributionConfig } from "@aws-sdk/client-cloudfront";
import { Request, Response } from "express";

interface GetPresignedUrlsRequest {
  workspaceId: string;
  distributionId: string;
  region: string;
  settings: DistributionConfig;
}

export const updateProjectController = async (
  req: Request<{}, {}, GetPresignedUrlsRequest>,
  res: Response
): Promise<void> => {
  const { workspaceId, distributionId, region, settings } = req.body;

  try {
    const updateData = await updateCloudFrontSettings(
      workspaceId,
      distributionId,
      region,
      settings
    );
    res
      .status(200)
      .send(
        createResponse(
          true,
          "Cloudfront config updated successfully.",
          updateData
        )
      );
  } catch (error) {
    res.status(500).send(
      createResponse(false, "An unexpected error occurred.", null, {
        message: (error as Error).message,
      })
    );
  }
};
