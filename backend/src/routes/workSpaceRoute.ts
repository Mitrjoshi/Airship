import { ServerRoutes } from "@/constants/ServerRoutes";
import { getProjectsController } from "@/controllers/projects/getProjectsController";
import { createWorkspaceController } from "@/controllers/workspace/createWorkspaceController";
import { getWorkspaceDetailsController } from "@/controllers/workspace/getWorkspaceDetails";
import { getWorkspacesController } from "@/controllers/workspace/getWorkspacesController";
import { Router } from "express";

const router = Router();

router.get("/", getWorkspacesController);

router.get(`/:workspaceId`, getProjectsController);

router.get(`/details/:workspaceId`, getWorkspaceDetailsController);

router.post(ServerRoutes.workspace.create, createWorkspaceController);

export default router;
