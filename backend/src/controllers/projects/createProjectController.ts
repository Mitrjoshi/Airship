import { CreateProjectRequest } from "@/interface/request";
import { CreateProject } from "@/services/projectServices";
import { createResponse } from "@/utils/createResponse";
import { Request, Response } from "express";

export const CreateProjectController = async (
  req: Request<{}, {}, CreateProjectRequest>,
  res: Response
) => {
  try {
    const data = await CreateProject(req.body);

    const projectData = {
      projectId: data.uuid,
      name: data.name,
      description: data.description,
      created_by: data.created_by,
      workspaceId: data.workspace_uuid,
      createdBy: data.created_by,
      service: data.service,
    };

    res
      .status(201)
      .send(createResponse(true, "Project Created Successfully", projectData));
  } catch (error) {
    res.status(500).send(
      createResponse(false, "An unexpected error occurred.", null, {
        message: (error as Error).message,
      })
    );
  }
};
