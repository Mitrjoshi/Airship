import { getRandomUuid } from "@/functions/getRandomUuid";
import { CreateProjectRequest } from "@/interface/request";
import { supabase } from "@/lib/supabase";

export const createProject = async (DATA: CreateProjectRequest) => {
  const { data: ProjectData, error } = await supabase
    .from("projects")
    .insert([{ ...DATA, id: getRandomUuid() }])
    .select()
    .maybeSingle();

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return ProjectData;
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

export const getSingleProject = async (
  projectId: string
  // workspaceId: string
) => {
  const { data: projects, error } = await supabase
    .from("projects")
    .select()
    .eq("id", projectId)
    // .eq("workspace_id", workspaceId)
    .maybeSingle();

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
  return projects;
};
