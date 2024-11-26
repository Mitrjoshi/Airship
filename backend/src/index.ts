import dotenv from "dotenv";
dotenv.config();

import express, { Express } from "express";
import projectRoutes from "@/routes/projectRoutes";
import workSpaceRoute from "@/routes/workSpaceRoute";
import providerRoutes from "@/routes/providerRoutes";
import deploymentRoute from "@/routes/deploymentRoutes";
import authRoutes from "@/routes/authRoutes";

import cors from "cors";
import { ServerRoutes } from "./constants/ServerRoutes";
import { verifyAuthTokenExpress } from "./utils/tokenUtils";

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use(ServerRoutes.auth.index, authRoutes);

app.use(verifyAuthTokenExpress);

app.use(ServerRoutes.workspace.index, workSpaceRoute);
app.use(ServerRoutes.projects.index, projectRoutes);
app.use(ServerRoutes.provider.index, providerRoutes);
app.use(ServerRoutes.deployments.index, deploymentRoute);

app.listen(port, async () => {
  console.log(`Server is running at http://localhost:${port}`);
});
