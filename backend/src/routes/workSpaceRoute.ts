import { ServerRoutes } from "@/constants/ServerRoutes";
import { createWorkspaceController } from "@/controllers/workspace/createWorkspace.controller";
import { getWorkspacesController } from "@/controllers/workspace/getWorkspacesController";
import { Router } from "express";

const router = Router();

router.get("/", getWorkspacesController);

router.post(ServerRoutes.workspace.create, createWorkspaceController);

export default router;
