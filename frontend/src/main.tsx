import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Root from "@/routes/Root";
import Dashboard from "@/routes/Dashboard";
import Workspace from "@/routes/Workspace";
import Project from "./routes/Project";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "workspace/:workspaceId",
        element: <Workspace />,
      },
      {
        path: "project/:projectId",
        element: <Project />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
