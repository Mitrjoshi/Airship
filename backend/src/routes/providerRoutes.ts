import { ServerRoutes } from "@/constants/ServerRoutes";
import { getPresignedUrlsController } from "@/controllers/provider/createSignedUrlController";
import { Router } from "express";

const router = Router();

router.post(ServerRoutes.provider.createSignedUrl, getPresignedUrlsController);

export default router;
