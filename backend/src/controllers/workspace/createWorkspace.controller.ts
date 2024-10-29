import { I_CREATE_INTERFACE_BODY } from "@/interface/request";
import { CreateWorkspaceSupabase } from "@/services/createWorkspace.service";
import { createResponse } from "@/utils/createResponse";
import { Request, Response } from "express";

export const CreateWorkspace = async (req: Request, res: Response) => {
  const REQ_BODY: I_CREATE_INTERFACE_BODY = req.body;

  try {
    const INSERT_DATA = await CreateWorkspaceSupabase(REQ_BODY);

    res
      .status(INSERT_DATA.status)
      .send(createResponse(false, INSERT_DATA.statusText, INSERT_DATA?.data));
  } catch (error: any) {
    res
      .status(400)
      .send(createResponse(false, "Invalid Request", null, error.message));
  }
};
