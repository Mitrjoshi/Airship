import {
  deleteBucket,
  deleteCloudfrontDistribution,
} from "@/services/AWSServices";
import { deleteProject, getProjects } from "@/services/projectServices";
import { createResponse } from "@/utils/createResponse";
import { Request, Response } from "express";

interface I_Request {
  workspaceId: string;
  distributionId: string;
  region: string;
  projectId: string;
  bucketName: string;
}

export const deleteProjectController = async (
  req: Request<{}, {}, I_Request>,
  res: Response
) => {
  const { projectId, distributionId, region, workspaceId, bucketName } =
    req.body;

  try {
    await deleteCloudfrontDistribution(workspaceId, distributionId, region);
    await deleteBucket(workspaceId, bucketName, region);
    await deleteProject(projectId);

    res
      .status(200)
      .json(createResponse(true, "Project deleted successfully.", true));
  } catch (error) {
    res.status(500).send(
      createResponse(false, "An unexpected error occurred.", null, {
        message: (error as Error).message,
      })
    );
  }
};
