import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Link, Outlet, RouterProvider } from 'react-router-dom'
import './index.css'
import Root from '@/routes/Root'
import CreateWorkspace from './routes/CreateWorkspace'
import CreateStaticWebsite from './routes/CreateStaticWebsite'
import WorkspaceList from './routes/WorkspaceList'
import ProjectList from './routes/ProjectList'
import ProjectPage from './routes/ProjectPage'
import { Button } from './components/ui/button'
import UploadFiles from './routes/UploadFiles'
import ProjectDetails from './routes/ProjectDetails'
import { ProjectConfiguration } from './routes/ProjectConfiguration'
import { ProjectSource } from './routes/ProjectSource'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <div className='p-6'>
        Landing page
        <div className='mt-2'>
          <Link to='/workspace'>
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    )
  },
  {
    path: '/workspace',
    element: <Root />,
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
          }
        ]
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
