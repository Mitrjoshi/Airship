import { ServerRoutes } from "@/constants/ServerRoutes";
import { createResponse } from "@/utils/createResponse";
import { Request, Response, Router } from "express";

const router = Router();

router.post(
  ServerRoutes.workspace.create,
  async (req: Request, res: Response) => {
    res.send(createResponse(true, "created"));
  }
);

export default router;
