import { CreateProjectRequest } from "@/interface/request";
import { supabase } from "@/lib/supabase";

export const createProject = async (DATA: CreateProjectRequest) => {
  const { data: ProjectData, error } = await supabase
    .from("projects")
    .insert([DATA])
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return ProjectData;
};

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
