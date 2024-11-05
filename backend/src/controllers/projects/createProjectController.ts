import { CreateProjectRequest } from "@/interface/request";
import { createS3Bucket } from "@/services/AWSServices";
import { createProject } from "@/services/projectServices";
import { createResponse } from "@/utils/createResponse";
import { Request, Response } from "express";

export const createProjectController = async (
  req: Request<{}, {}, CreateProjectRequest>,
  res: Response
) => {
  try {
    const data = await createProject(req.body);
    const bucketName = data.name.toLowerCase().replace(/\s+/g, "-");

    await createS3Bucket(bucketName, req.body.workspace_id);

    const projectData = {
      projectId: data.id,
      name: data.name,
      description: data.description,
      created_by: data.created_by,
      workspaceId: data.workspace_id,
      createdBy: data.created_by,
      service: data.service,
    };

    res
      .status(201)
      .send(
        createResponse(
          true,
          "Project and bucket Created Successfully",
          projectData
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
