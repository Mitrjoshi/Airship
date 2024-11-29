import PageContainer from '@/components/shared/PageContainer'
import TitleHeader from '@/components/shared/TitleHeader'
import { Button } from '@/components/ui/button'
import { useGetSingleProject } from '@/services/useGetSingleProject'
import { Link, Outlet, useParams } from 'react-router-dom'
import { FolderOpen, SettingsIcon, Users } from 'lucide-react'
import { PlusIcon, UpdateIcon } from '@radix-ui/react-icons'
import LoadingButton from '@/components/shared/LoadingButton'

export default function ProjectPage() {
  const { projectId } = useParams()

  const { refetch: refetchProjectData, isRefetching: isProjectDataLoading } = useGetSingleProject(projectId as string)

  return (
    <PageContainer>
      <TitleHeader
        title={'Latest deployment'}
        showBackBtn
        element={
          <div className='flex items-center gap-2'>
            <LoadingButton
              variant='outline'
              size='sm'
              onClick={() => refetchProjectData()}
              isLoading={isProjectDataLoading}
            >
              <UpdateIcon className='h-4 w-4' />
              Refresh
            </LoadingButton>

            <Link to={'source'}>
              <Button variant='outline' size='sm'>
                <FolderOpen className='h-4 w-4' />
                Source
              </Button>
            </Link>

            <Link to={'config'}>
              <Button variant='outline' size='sm'>
                <SettingsIcon className='h-4 w-4' />
                Configurations
              </Button>
            </Link>

            <Button variant='outline' size='sm'>
              <Users className='h-4 w-4' />
              Members
            </Button>

            <Link to={'upload'}>
              <Button size='sm'>
                <PlusIcon className='h-4 w-4' />
                New Deployment
              </Button>
            </Link>
          </div>
        }
      />

      <Outlet />
    </PageContainer>
  )
}
