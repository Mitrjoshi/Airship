import { ServerRoutes } from "@/constants/ServerRoutes";
import { createProjectController } from "@/controllers/projects/createProjectController";
import { getSingleProjectController } from "@/controllers/projects/getSingleProjectController";
import { Router } from "express";

const router = Router();

router.post(ServerRoutes.projects.create, createProjectController);
router.post(ServerRoutes.projects.index, createProjectController);
router.get(`/:projectId`, getSingleProjectController);

export default router;
