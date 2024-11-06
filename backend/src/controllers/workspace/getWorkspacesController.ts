import { getProjects } from "@/services/projectServices";
import { getWorkspaces } from "@/services/workspaceServices";
import { createResponse } from "@/utils/createResponse";
import { Request, Response } from "express";

export const getWorkspacesController = async (req: Request, res: Response) => {
  let userId = "123";
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
