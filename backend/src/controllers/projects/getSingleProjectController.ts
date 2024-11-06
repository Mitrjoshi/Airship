import { getProjects, getSingleProject } from "@/services/projectServices";
import { createResponse } from "@/utils/createResponse";
import { Request, Response } from "express";

export const getSingleProjectController = async (
  req: Request,
  res: Response
) => {
  const { projectId } = req.params;

  try {
    //Fetch project details
    const projects = await getSingleProject(projectId);

    res
      .status(200)
      .json(createResponse(true, "Project retrieved successfully", projects));
  } catch (error) {
    res.status(500).send(
      createResponse(false, "An unexpected error occurred.", null, {
        message: (error as Error).message,
      })
    );
  }
};
