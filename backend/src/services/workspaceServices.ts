import { getRandomUuid } from "@/functions/getRandomUuid";
import { I_CREATE_INTERFACE_BODY } from "@/interface/request";
import { supabase } from "@/lib/supabase";

export const createWorkspace = async (DATA: I_CREATE_INTERFACE_BODY) => {
  const data = await supabase
    .from("workspaces")
    .insert([
      {
        name: DATA.name,
        company_name: DATA.company_name,
        description: DATA.description,
        created_by: DATA.created_by,
        id: getRandomUuid(),
      },
    ])
    .select()
    .maybeSingle();

  if (data.error) {
    throw Error(data.error.message);
  }

  const { error } = await supabase.from("credentials").insert([
    {
      workspace_id: data.data?.id,
      access_key: DATA.access_key,
      secret_key: DATA.secret_key,
    },
  ]);

  if (error) {
    throw Error(error.message);
  }

  return data;
};

export const getWorkspaces = async (userId: string) => {
  const { data: workspaces, error } = await supabase
    .from("workspaces")
    .select()
    .eq("created_by", "123");

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
  return workspaces;
};

export const getWorkspaceById = async (workspaceId: string) => {
  const { data: workspaceData, error } = await supabase
    .from("workspaces")
    .select(
      "*, projects ( id, name, type, created_at, description, environment, users ( id, username ) )"
    )
    .eq("id", workspaceId)
    .maybeSingle();

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
  return workspaceData;
};

export const getAWSCredentials = async (workspaceId: string) => {
  const { data: credentials, error } = await supabase
    .from("credentials")
    .select("*")
    .eq("workspace_id", workspaceId)
    .maybeSingle();

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
  return credentials;
};
