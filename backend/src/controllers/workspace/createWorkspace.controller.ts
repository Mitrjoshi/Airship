import { I_CREATE_INTERFACE_BODY } from "@/interface/request";
import { CreateWorkspaceSupabase } from "@/services/createWorkspace.service";
import { createResponse } from "@/utils/createResponse";
import { Request, Response } from "express";

export const CreateWorkspace = async (
  req: Request<{}, {}, I_CREATE_INTERFACE_BODY>,
  res: Response
) => {
  try {
    const INSERT_DATA = await CreateWorkspaceSupabase(req.body);

    res
      .status(INSERT_DATA.status)
      .send(createResponse(false, INSERT_DATA.statusText, INSERT_DATA?.data));
  } catch (error: any) {
    res
      .status(500)
      .send(createResponse(false, "Invalid Request", null, error.message));
  }
};
