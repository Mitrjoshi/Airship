import { I_CREATE_INTERFACE_BODY } from "@/interface/request";
import { supabase } from "@/lib/supabase";
import { createWorkspace } from "@/services/workspaceServices";
import { createResponse } from "@/utils/createResponse";
import { Request, Response } from "express";

export const createWorkspaceController = async (
  req: Request<{}, {}, I_CREATE_INTERFACE_BODY>,
  res: Response
) => {
  const {
    name,
    company_name,
    description,
    created_by,
    access_key,
    secret_key,
    region,
  } = req.body;
  try {
    const { data: INSERT_DATA, error } = await supabase.rpc(
      "create_workspace_with_credentials",
      {
        workspace_name: name,
        company_name,
        description,
        created_by,
        access_key,
        secret_key,
        region,
      }
    );

    // Check for errors from the procedure
    if (error) {
      console.error("Error creating workspace with credentials:", error);
      throw new Error("Failed to create workspace and insert credentials.");
    }

    const NEW_INSERT_DATA = {
      workspace_id: INSERT_DATA?.data.id,
      name: INSERT_DATA?.data.name,
      company_name: INSERT_DATA?.data.company_name,
      description: INSERT_DATA?.data.description,
      created_by: INSERT_DATA?.data.created_by,
    };

    res
      .status(INSERT_DATA.status)
      .send(createResponse(true, INSERT_DATA.statusText, NEW_INSERT_DATA));
  } catch (error: any) {
    res
      .status(500)
      .send(createResponse(false, "Invalid Request", null, error.message));
  }
};
