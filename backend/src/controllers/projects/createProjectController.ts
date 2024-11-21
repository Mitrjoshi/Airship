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

    const cloudFrontData = await createStaticWebsite(
      BODY.bucket_name,
      BODY.workspace_id,
      BODY.region
    );

    if (cloudFrontData) {
      const projectData: CreateProjectRequest = {
        name: BODY.name,
        description: BODY.description,
        created_by: BODY.created_by,
        type: BODY.type,
        bucket_name: BODY.bucket_name,
        workspace_id: BODY.workspace_id,
        distribution_id: cloudFrontData.id,
        cloudfront_url: cloudFrontData.url,
        region: BODY.region,
        environment: BODY.environment,
      };

      const data = await createProject(projectData);

      res.status(201).send(
        createResponse(true, "Project and bucket Created Successfully", {
          projectId: data,
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
