import { getProjects } from "@/services/projectServices";
import { createResponse } from "@/utils/createResponse";
import { Request, Response } from "express";

export const getProjectsController = async (req: Request, res: Response) => {
  const { workspaceId } = req.params;

  try {
    //Fetch project details
    const projects = await getProjects(workspaceId);

    console.log(projects);

    res
      .status(200)
      .json(createResponse(true, "Projects retrieved successfully", projects));
  } catch (error) {
    res.status(500).send(
      createResponse(false, "An unexpected error occurred.", null, {
        message: (error as Error).message,
      })
    );
  }
};
