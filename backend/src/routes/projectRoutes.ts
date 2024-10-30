import { ServerRoutes } from "@/constants/ServerRoutes";
import { CreateProjectController } from "@/controllers/projects/createProjectController";
import { Router } from "express";

const router = Router();

router.post(ServerRoutes.projects.create, CreateProjectController);

export default router;
