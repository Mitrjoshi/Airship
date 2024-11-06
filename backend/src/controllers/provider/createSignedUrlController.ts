import { createSignedUrl } from "@/services/AWSServices";
import { createResponse } from "@/utils/createResponse";
import { Request, Response } from "express";

interface I_Resquest {
  bucketName: string;
  workspaceId: string;
}

export const createSignedUrlController = async (
  req: Request<{}, {}, I_Resquest>,
  res: Response
) => {
  try {
    const { bucketName, workspaceId } = req.body;

    const signedUrl = await createSignedUrl(bucketName, workspaceId);

    if (signedUrl) {
      res
        .status(200)
        .send(
          createResponse(true, "Signed Url created successfully.", signedUrl)
        );
    } else {
      res.status(200).send(
        createResponse(false, "An unexpected error occurred.", null, {
          message: "Unable to create signed url.",
        })
      );
    }
  } catch (error) {
    res.status(500).send(
      createResponse(false, "An unexpected error occurred.", null, {
        message: (error as Error).message,
      })
    );
  }
};
