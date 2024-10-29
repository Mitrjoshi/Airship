import dotenv from "dotenv";
dotenv.config();

import express, { Express } from "express";
import CreateWorkspace from "./routes/workspace/CreateWorkspace.route";
import { ServerRoutes } from "./constants/ServerRoutes";

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(ServerRoutes.workspace.index, CreateWorkspace);

app.listen(port, async () => {
  console.log(`Server is running at http://localhost:${port}`);
});
