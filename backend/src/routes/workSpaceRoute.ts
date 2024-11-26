import { ServerRoutes } from "@/constants/ServerRoutes";
import { getProjectsController } from "@/controllers/projects/getProjectsController";
import { createWorkspaceController } from "@/controllers/workspace/createWorkspaceController";
import { getWorkspaceDetailsController } from "@/controllers/workspace/getWorkspaceDetails";
import { getWorkspacesController } from "@/controllers/workspace/getWorkspacesController";
import { verifyAuthTokenExpress } from "@/utils/tokenUtils";
import { Router } from "express";

const router = Router();

router.get("/", verifyAuthTokenExpress, getWorkspacesController);

router.get(`/:workspaceId`, getProjectsController);

router.get(`/details/:workspaceId`, getWorkspaceDetailsController);

router.post(ServerRoutes.workspace.create, createWorkspaceController);

export default router;
