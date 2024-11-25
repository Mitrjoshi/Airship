import { createCloudFrontInvalidation } from "@/services/AWSServices";
import { createResponse } from "@/utils/createResponse";
import { Request, Response } from "express";

interface invalidateCloudFrontRequest {
  workspaceId: string;
  distributionId: string;
  region: string;
  path: string;
}

export const invalidateCloudFront = async (
  req: Request<{}, {}, invalidateCloudFrontRequest>,
  res: Response
): Promise<void> => {
  const { workspaceId, distributionId, path, region } = req.body;

  try {
    const invalidations = await createCloudFrontInvalidation(
      workspaceId,
      distributionId,
      region,
      path
    );
    res
      .status(200)
      .send(
        createResponse(
          true,
          "Invalidation created successfully.",
          invalidations
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
