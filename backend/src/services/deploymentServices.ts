import { I_CREATE_DEPLOYMENT } from "@/interface/request";
import { supabase } from "@/lib/supabase";

export const createDeploymentService = async (DATA: I_CREATE_DEPLOYMENT) => {
  const data = await supabase
    .from("deployments")
    .insert([
      {
        project_id: DATA.project_id,
        deployed_by: DATA.deployed_by,
        deployment_msg: DATA.deployment_msg,
      },
    ])
    .select();

  if (data.error) {
    throw Error(data.error.message);
  }

  return data;
};

export const getDeploymentsByProjectId = async (projectId: string) => {
  const { data: deployments, error } = await supabase
    .from("deployments")
    .select("*, users ( username )")
    .eq("project_id", projectId)
    .limit(5)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
  return deployments;
};
