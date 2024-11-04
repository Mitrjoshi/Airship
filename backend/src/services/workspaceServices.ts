import { I_CREATE_INTERFACE_BODY } from "@/interface/request";
import { supabase } from "@/lib/supabase";

export const createWorkspace = async (DATA: I_CREATE_INTERFACE_BODY) => {
  const data = await supabase
    .from("workspaces")
    .insert([DATA])
    .select()
    .maybeSingle();

  if (data.error) {
    throw Error(data.error.message);
  }

  return data;
};

export const getWorkspaces = async (userId: string) => {
  const { data: workspaces, error } = await supabase
    .from("workspaces")
    .select()
    .eq("created_by", userId);

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
  return workspaces;
};
