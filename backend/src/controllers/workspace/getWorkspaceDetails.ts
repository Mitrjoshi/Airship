import { getWorkspaceById } from "@/services/workspaceServices";
import { createResponse } from "@/utils/createResponse";
import { Request, Response } from "express";

export const getWorkspaceDetailsController = async (
  req: Request,
  res: Response
) => {
  const { workspaceId } = req.params;

  try {
    //Fetch workspace details
    const workspaceData = await getWorkspaceById(workspaceId);

    res
      .status(200)
      .json(
        createResponse(
          true,
          "Workspace data retrieved successfully",
          workspaceData
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
