import { ServerRoutes } from "@/constants/ServerRoutes";
import { getPresignedUrlsController } from "@/controllers/provider/createSignedUrlController";
import { getS3Files } from "@/controllers/provider/getS3Files";
import { invalidateCloudFront } from "@/controllers/provider/invalidateCloudFront";
import { Router } from "express";

const router = Router();

router.post(ServerRoutes.provider.createSignedUrl, getPresignedUrlsController);
router.post(ServerRoutes.provider.invalidateCloudFront, invalidateCloudFront);
router.post(ServerRoutes.provider.getS3Files, getS3Files);

export default router;
