import { getProjects } from "@/services/projectServices";
import { getWorkspaces } from "@/services/workspaceServices";
import { createResponse } from "@/utils/createResponse";
import { Request, Response } from "express";

export const getWorkspacesController = async (req: Request, res: Response) => {
  let userId = "35ed859f-0fb6-4c5d-8f27-45e13612beb8";
  try {
    //Fetch workspace details
    const workspaces = await getWorkspaces(userId);

    res
      .status(200)
      .json(
        createResponse(true, "Workspaces retrieved successfully", workspaces)
      );
  } catch (error) {
    res.status(500).send(
      createResponse(false, "An unexpected error occurred.", null, {
        message: (error as Error).message,
      })
    );
  }
};
