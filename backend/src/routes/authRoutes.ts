import { ServerRoutes } from "@/constants/ServerRoutes";
import { loginController } from "@/controllers/auth/loginController";
import { signUpController } from "@/controllers/auth/signUpController";
import { Router } from "express";

const router = Router();

router.post(ServerRoutes.auth.login, loginController);
router.post(ServerRoutes.auth.signup, signUpController);

export default router;
