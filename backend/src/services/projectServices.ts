import { CreateProjectRequest } from "@/interface/request";
import { supabase } from "@/lib/supabase";

export const CreateProject = async (DATA: CreateProjectRequest) => {
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
