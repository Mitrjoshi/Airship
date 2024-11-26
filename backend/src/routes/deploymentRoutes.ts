import { ServerRoutes } from "@/constants/ServerRoutes";
import { createDeploymentController } from "@/controllers/deployments/createDeploymentController";
import { getDeploymentsController } from "@/controllers/deployments/getDeploymentsController";
import { verifyAuthTokenExpress } from "@/utils/tokenUtils";
import { Router } from "express";

const router = Router();

router.get("/:projectId", getDeploymentsController);
router.post(ServerRoutes.deployments.create, createDeploymentController);

export default router;
