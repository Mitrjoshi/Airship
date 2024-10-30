import dotenv from "dotenv";
dotenv.config();

import express, { Express } from "express";
import CreateWorkspace from "./routes/workspace/CreateWorkspace.route";
import projectRoutes from "@/routes/projectRoutes";
import { ServerRoutes } from "./constants/ServerRoutes";
import cors from "cors";

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use(ServerRoutes.workspace.index, CreateWorkspace);
app.use(ServerRoutes.projects.index, projectRoutes);

app.listen(port, async () => {
  console.log(`Server is running at http://localhost:${port}`);
});
