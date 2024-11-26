export const ServerRoutes = {
  workspace: {
    index: "/workspace",
    create: "/create",
    update: "/update",
    delete: "/delete",
    view: "/view",
    invite: "/invite",
    join: "/join",
  },
  auth: {
    index: "/auth",
    login: "/login",
    signup: "/signup",
    profile: "/profile",
    update: "/update",
    logout: "/logout",
  },
  projects: {
    index: "/projects",
    create: "/create",
    update: "/update",
    delete: "/delete",
    view: "/view",
    invite: "/invite",
    join: "/join",
  },
  provider: {
    index: "/provider",
    createSignedUrl: "/create-signed-url",
    invalidateCloudFront: "/invalidate",
    getS3Files: "/get-files",
  },
  deployments: {
    index: "/deployments",
    create: "/create",
  },
};
