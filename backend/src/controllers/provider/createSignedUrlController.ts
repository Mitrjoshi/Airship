import { createSignedUrls } from "@/services/AWSServices";
import { createResponse } from "@/utils/createResponse";
import { Request, Response } from "express";

interface I_Request {
  bucketName: string;
  workspaceId: string;
  fileKeys: string[];
}

export const createSignedUrlController = async (
  req: Request<{}, {}, I_Request>,
  res: Response
) => {
  try {
    const { bucketName, workspaceId, fileKeys } = req.body;

    const signedUrls = await createSignedUrls(
      bucketName,
      workspaceId,
      fileKeys
    );

    if (signedUrls && Object.keys(signedUrls).length > 0) {
      res
        .status(200)
        .send(
          createResponse(true, "Signed URLs created successfully.", signedUrls)
        );
    } else {
      res.status(200).send(
        createResponse(false, "An unexpected error occurred.", null, {
          message: "Unable to create signed URLs.",
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
