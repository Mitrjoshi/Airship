import { uploadFiles } from "@/services/AWSServices";
import { createResponse } from "@/utils/createResponse";
import { Request, Response } from "express";

interface I_Resquest {
  bucketName: string;
  workspaceId: string;
  files: File[];
}

export const uploadFileToProvider = async (
  req: Request<{}, {}, I_Resquest>,
  res: Response
) => {
  try {
    const { bucketName, workspaceId, files } = req.body;

    const uploadData = await uploadFiles(bucketName, workspaceId, files);

    res.send(uploadData);
  } catch (error) {
    res.status(500).send(
      createResponse(false, "An unexpected error occurred.", null, {
        message: (error as Error).message,
      })
    );
  }
};
