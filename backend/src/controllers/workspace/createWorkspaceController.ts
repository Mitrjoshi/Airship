import { I_CREATE_WORKSPACE_BODY } from "@/interface/request";
import { createWorkspace } from "@/services/workspaceServices";
import { createResponse } from "@/utils/createResponse";
import { Request, Response } from "express";

export const createWorkspaceController = async (
  req: Request<{}, {}, I_CREATE_WORKSPACE_BODY>,
  res: Response
) => {
  try {
    const INSERT_DATA = await createWorkspace(req.body);

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
