import { getDeploymentsByProjectId } from "@/services/deploymentServices";
import { createResponse } from "@/utils/createResponse";
import { Request, Response } from "express";

export const getDeploymentsController = async (req: Request, res: Response) => {
  const { projectId } = req.params;

  try {
    //Fetch project details
    const deployments = await getDeploymentsByProjectId(projectId);

    res
      .status(200)
      .json(
        createResponse(true, "Projects retrieved successfully", deployments)
      );
  } catch (error) {
    res.status(500).send(
      createResponse(false, "An unexpected error occurred.", null, {
        message: (error as Error).message,
      })
    );
  }
};
