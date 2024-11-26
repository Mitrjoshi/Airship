import { I_CREATE_WORKSPACE_BODY } from "@/interface/request";
import { createWorkspace } from "@/services/workspaceServices";
import { createResponse } from "@/utils/createResponse";
import { AuthenticatedRequest } from "@/utils/tokenUtils";
import { Request, Response } from "express";

export const createWorkspaceController = async (
  req: AuthenticatedRequest<{}, {}, I_CREATE_WORKSPACE_BODY>,
  res: Response
) => {
  try {
    const INSERT_DATA = await createWorkspace({
      ...req.body,
      created_by: req.user?.id!,
    });

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
