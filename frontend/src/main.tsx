import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import './index.css'
import Root from '@/routes/Root'
import CreateWorkspace from './routes/CreateWorkspace'
import CreateStaticWebsite from './routes/CreateStaticWebsite'
import WorkspaceList from './routes/WorkspaceList'
import ProjectList from './routes/ProjectList'
import ProjectPage from './routes/ProjectPage'
import UploadFiles from './routes/UploadFiles'
import ProjectDetails from './routes/ProjectDetails'
import { ProjectConfiguration } from './routes/ProjectConfiguration'
import { ProjectSource } from './routes/ProjectSource'
import { SignUp } from './routes/SignUp'
import { Auth } from './routes/Auth'
import Login from './routes/Login'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { WorkspaceSettings } from './routes/WorkspaceSettings'
import { ProtectedRoutes } from './components/shared/ProtectedRoutes'
import { PublicRoutes } from './components/shared/PublicRoutes'
import { ErrorPage } from './routes/ErrorPage'
import { LandingPage } from './routes/LandingPage'
import CreateLambdaFunction from './routes/CreateLambdaFunction'

export const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    index: true,
    element: <LandingPage />
  },
  {
    path: '*',
    element: <ErrorPage />
  },
  {
    path: '/auth',
    element: (
      <PublicRoutes>
        <Auth />
      </PublicRoutes>
    ),
    children: [
      {
        index: true,
        element: <Login />
      },
      {
        path: 'sign-up',
        element: <SignUp />
      }
    ]
  },
  {
    path: '/workspace',
    element: (
      <ProtectedRoutes>
        <Root />
      </ProtectedRoutes>
    ),
    children: [
      {
        index: true,
        element: <WorkspaceList />
      },
      {
        path: 'create',
        element: <CreateWorkspace />
      },
      {
        path: ':workspaceId',
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <ProjectList />
          },
          {
            path: 'settings',
            element: <WorkspaceSettings />
          },
          {
            path: ':projectId',
            element: <ProjectPage />,
            children: [
              {
                index: true,
                element: <ProjectDetails />
              },
              {
                path: 'upload',
                element: <UploadFiles />
              },
              {
                path: 'config',
                element: <ProjectConfiguration />
              },
              {
                path: 'source',
                element: <ProjectSource />
              }
            ]
          },
          {
            path: 'create-static-website',
            element: <CreateStaticWebsite />
          },
          {
            path: 'create-lambda-function',
            element: <CreateLambdaFunction />
          }
        ]
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />

      <Toaster position='top-right' richColors theme='light' toastOptions={{ duration: 2500 }} />
    </QueryClientProvider>
  </StrictMode>
)
