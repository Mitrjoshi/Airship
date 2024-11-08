import { ServerRoutes } from "@/constants/ServerRoutes";
import { createSignedUrlController } from "@/controllers/provider/createSignedUrlController";
import { uploadFileToProvider } from "@/controllers/provider/uploadFileToProvider";
import { Router } from "express";

const router = Router();

router.post(ServerRoutes.provider.createSignedUrl, createSignedUrlController);
router.post(ServerRoutes.provider.uploadFile, uploadFileToProvider);

export default router;
