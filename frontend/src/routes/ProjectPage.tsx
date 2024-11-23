import PageContainer from '@/components/shared/PageContainer'
import TitleHeader from '@/components/shared/TitleHeader'
import { Button } from '@/components/ui/button'
import { useGetSingleProject } from '@/services/useGetSingleProject'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { Loader, SettingsIcon } from 'lucide-react'
import { PlusIcon, UpdateIcon } from '@radix-ui/react-icons'

export default function ProjectPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()

  const {
    data: projectData,
    refetch: refetchProjectData,
    isRefetching: isProjectDataLoading
  } = useGetSingleProject(projectId as string)

  return (
    <PageContainer>
      <TitleHeader
        title={projectData?.data?.name || 'Project Name'}
        showBackBtn
        element={
          <div className='flex items-center gap-2'>
            <Button
              className='relative'
              disabled={isProjectDataLoading}
              onClick={() => refetchProjectData()}
              variant='outline'
              size='sm'
            >
              {isProjectDataLoading && (
                <span className='absolute inset-0 flex items-center justify-center'>
                  <Loader className='h-4 w-4 animate-spin' />
                </span>
              )}

              <span className={`flex items-center gap-2 ${isProjectDataLoading ? 'invisible' : ''}`}>
                <UpdateIcon className='h-4 w-4' />
                Refresh
              </span>
            </Button>

            <Button onClick={() => navigate('config')} variant='outline' size='sm'>
              <SettingsIcon className='h-4 w-4' />
              Configurations
            </Button>

            <Button onClick={() => navigate('upload')} size='sm'>
              <PlusIcon className='h-4 w-4' />
              New Deployment
            </Button>
          </div>
        }
      />

      <Outlet />
    </PageContainer>
  )
}
