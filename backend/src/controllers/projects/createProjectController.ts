import { CreateProjectRequest } from "@/interface/request";
import { createStaticWebsite } from "@/services/AWSServices";
import { createProject, updateProject } from "@/services/projectServices";
import { createResponse } from "@/utils/createResponse";
import { Request, Response } from "express";

export const createProjectController = async (
  req: Request<{}, {}, CreateProjectRequest>,
  res: Response
) => {
  try {
    const BODY = req.body;

    const bucketName = BODY.name.toLowerCase().replace(/\s+/g, "-");
    const bucketData = await createStaticWebsite(bucketName, BODY.workspace_id);

    if (bucketData) {
      const projectData: CreateProjectRequest = {
        name: BODY.name,
        description: BODY.description,
        created_by: BODY.created_by,
        service: BODY.service,
        domain: bucketData,
        bucket_name: bucketName,
        workspace_id: BODY.workspace_id,
        provider: BODY.provider,
      };

      const data = await createProject(projectData);

      res.status(201).send(
        createResponse(true, "Project and bucket Created Successfully", {
          ...data,
          projectId: data.id,
        })
      );
    }
  } catch (error) {
    res.status(500).send(
      createResponse(false, "An unexpected error occurred.", null, {
        message: (error as Error).message,
      })
    );
  }
};
