import { I_CREATE_INTERFACE_BODY } from "@/interface/request";
import { supabase } from "@/lib/supabase";

export const CreateWorkspaceSupabase = async (
  DATA: I_CREATE_INTERFACE_BODY
) => {
  const data = await supabase
    .from("workspaces")
    .insert([DATA])
    .select()
    .single();

  if (data.error) {
    throw Error(data.error.message);
  }

  return data;
};
