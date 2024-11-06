import { ServerRoutes } from "@/constants/ServerRoutes";
import { getProjectsController } from "@/controllers/projects/getProjectsController";
import { createWorkspaceController } from "@/controllers/workspace/createWorkspaceController";
import { getWorkspacesController } from "@/controllers/workspace/getWorkspacesController";
import { Router } from "express";

const router = Router();

router.get(ServerRoutes.workspace.index, getWorkspacesController);

router.get(
  `${ServerRoutes.workspace.index}/:workspaceId`,
  getProjectsController
);

router.post(ServerRoutes.workspace.create, createWorkspaceController);

export default router;
