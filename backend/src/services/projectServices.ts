import { getRandomUuid } from "@/functions/getRandomUuid";
import { CreateProjectRequest } from "@/interface/request";
import { supabase } from "@/lib/supabase";

export const createProject = async (DATA: CreateProjectRequest) => {
  const projectId = getRandomUuid();

  const { error } = await supabase.rpc("create_static_website_project", {
    p_project_id: projectId,
    p_name: DATA.name,
    p_description: DATA.description,
    p_created_by: DATA.created_by,
    p_type: DATA.type,
    p_region: DATA.region,
    p_workspace_id: DATA.workspace_id,
    p_cloudfront_url: DATA.cloudfront_url,
    p_distribution_id: DATA.distribution_id,
    p_bucket_name: DATA.bucket_name,
    p_environment: DATA.environment,
    swp_id: getRandomUuid(),
  });

  if (error) {
    console.error("Error:", error);
    throw new Error(error.message);
  }

  return projectId;
};

export const updateProject = async () => {};

export const getProjects = async (WorkspaceId: string) => {
  const { data: projects, error } = await supabase
    .from("projects")
    .select()
    .eq("workspace_id", WorkspaceId);

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
  return projects;
};

export const getSingleProject = async (projectId: string) => {
  const { data: projects, error: projectError } = await supabase
    .from("projects")
    .select("*, users ( username ), static_website_project ( * )")
    .eq("id", projectId)
    .maybeSingle();

  if (projectError) {
    throw new Error(projectError.message);
  }

  return {
    ...projects,
  };
};
