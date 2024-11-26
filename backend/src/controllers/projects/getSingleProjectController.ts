import {
  fetchCloudFrontSettings,
  getCloudfrontStatus,
} from "@/services/AWSServices";
import { getSingleProject } from "@/services/projectServices";
import { createResponse } from "@/utils/createResponse";
import { AuthenticatedRequest } from "@/utils/tokenUtils";
import { Request, Response } from "express";

export const getSingleProjectController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { projectId } = req.params;

  try {
    //Fetch project details
    const projects = await getSingleProject(projectId as string);

    const status = await getCloudfrontStatus(
      projects.workspace_id,
      projects.static_website_project[0].distribution_id,
      projects.region
    );

    const cloudfrontConfig = await fetchCloudFrontSettings(
      projects.workspace_id,
      projects.static_website_project[0].distribution_id,
      projects.region
    );

    res.status(200).json(
      createResponse(true, "Project retrieved successfully", {
        created_at: projects.created_at,
        name: projects.name,
        description: projects.description,
        type: projects.type,
        workspace_id: projects.workspace_id,
        created_by: projects.created_by,
        id: projects.id,
        updated_at: projects.updated_at,
        environment: projects.environment,
        region: projects.region,
        cloudfront_url: projects.static_website_project[0].cloudfront_url,
        distribution_id: projects.static_website_project[0].distribution_id,
        bucket_name: projects.static_website_project[0].bucket_name,
        status,
        cloudfrontConfig,
        users: {
          ...projects.users,
        },
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
