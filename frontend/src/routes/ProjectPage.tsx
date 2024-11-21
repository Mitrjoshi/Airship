import PageContainer from '@/components/shared/PageContainer'
import TitleHeader from '@/components/shared/TitleHeader'
import { Button } from '@/components/ui/button'
import { useGetSingleProject } from '@/services/useGetSingleProject'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { RotateCcw, SettingsIcon } from 'lucide-react'
import { PlusIcon } from '@radix-ui/react-icons'

export default function ProjectPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()

  const { data: projectData } = useGetSingleProject(projectId as string)

  return (
    <PageContainer>
      <TitleHeader
        title={projectData?.data?.name || 'Project Name'}
        showBackBtn
        element={
          <div className='flex items-center gap-2'>
            <Button variant='outline' size='sm'>
              <RotateCcw className='h-4 w-4' />
              Instant rollback
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

      <Outlet context={{ projectId, projectData }} />
    </PageContainer>
  )
}
