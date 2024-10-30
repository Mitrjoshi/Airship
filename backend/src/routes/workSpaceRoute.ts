import { ServerRoutes } from "@/constants/ServerRoutes";
import { CreateWorkspace } from "@/controllers/workspace/createWorkspace.controller";
import { Router } from "express";

const router = Router();

router.post(ServerRoutes.workspace.create, CreateWorkspace);

export default router;
