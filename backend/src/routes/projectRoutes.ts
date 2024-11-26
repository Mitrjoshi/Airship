import { ServerRoutes } from "@/constants/ServerRoutes";
import { createProjectController } from "@/controllers/projects/createProjectController";
import { getSingleProjectController } from "@/controllers/projects/getSingleProjectController";
import { updateProjectController } from "@/controllers/projects/updateProjectController";
import { Router } from "express";

const router = Router();

router.get(`/:projectId`, getSingleProjectController);
router.post(ServerRoutes.projects.create, createProjectController);
router.post(ServerRoutes.projects.index, createProjectController);
router.post(ServerRoutes.projects.update, updateProjectController);

export default router;
