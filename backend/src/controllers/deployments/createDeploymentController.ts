import { I_CREATE_DEPLOYMENT } from "@/interface/request";
import { createDeploymentService } from "@/services/deploymentServices";
import { createResponse } from "@/utils/createResponse";
import { Request, Response } from "express";

export const createDeploymentController = async (
  req: Request<{}, {}, I_CREATE_DEPLOYMENT>,
  res: Response
) => {
  try {
    const BODY = req.body;

    const projectData: I_CREATE_DEPLOYMENT = {
      project_id: BODY.project_id,
      deployed_by: BODY.deployed_by || "123",
      deployment_msg: BODY.deployment_msg,
    };

    const data = await createDeploymentService(projectData);

    res.status(201).send(
      createResponse(true, "Deployment created successfully", {
        projectId: data,
      })
    );
  } catch (error) {
    res.status(500).send(
      createResponse(false, "An unexpected error occurred.", null, {
        message: (error as Error).message,
      })
    );
  }
};
