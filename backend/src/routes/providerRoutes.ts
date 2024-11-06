import { ServerRoutes } from "@/constants/ServerRoutes";
import { createSignedUrlController } from "@/controllers/provider/createSignedUrlController";
import { Router } from "express";

const router = Router();

router.post(ServerRoutes.provider.createSignedUrl, createSignedUrlController);

export default router;
