import { ServerRoutes } from "@/constants/ServerRoutes";
import { CreateWorkspace } from "@/controllers/workspace/createWorkspace.controller";
import { Request, Response, Router } from "express";

const router = Router();

router.post(
  ServerRoutes.workspace.create,
  async (req: Request, res: Response) => {
    await CreateWorkspace(req, res);
  }
);

export default router;
