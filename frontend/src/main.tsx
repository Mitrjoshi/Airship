import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Root from "@/routes/Root";
import CreateWorkspace from "./routes/CreateWorkspace";
import CreateStaticWebsite from "./routes/CreateStaticWebsite";
import WorkspaceList from "./routes/WorkspaceList";
import ProjectList from "./routes/ProjectList";
import ProjectDetails from "./routes/Project";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <Navigate to="/workspace" />,
      },
      {
        path: "workspace",
        children: [
          {
            index: true,
            element: <WorkspaceList />,
          },
          {
            path: "create",
            element: <CreateWorkspace />,
          },
          {
            path: ":workspaceId",
            element: <Outlet />,
            children: [
              {
                index: true,
                element: <ProjectList />,
              },
              {
                path: ":projectId",
                element: <ProjectDetails />,
              },
              {
                path: "create-static-website",
                element: <CreateStaticWebsite />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
