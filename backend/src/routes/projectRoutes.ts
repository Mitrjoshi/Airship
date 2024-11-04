import { ServerRoutes } from "@/constants/ServerRoutes";
import { createProjectController } from "@/controllers/projects/createProjectController";
import { getProjectsController } from "@/controllers/projects/getProjectsController";
import { Router } from "express";

const router = Router();

router.get("/:workspaceId", getProjectsController);

router.post(ServerRoutes.projects.create, createProjectController);

export default router;
