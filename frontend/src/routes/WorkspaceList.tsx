import { Button } from '@/components/ui/button'
import { useGetWorkspaces } from '@/services/useGetWorkspaces'
import { Link, useNavigate } from 'react-router-dom'
import { formatDate } from '@/utils/utils'
import PageContainer from '@/components/shared/PageContainer'
import TitleHeader from '@/components/shared/TitleHeader'
import { PersonIcon, PlusIcon } from '@radix-ui/react-icons'

export default function WorkspaceList() {
  const { data: workspaces } = useGetWorkspaces()

  return (
    <PageContainer>
      <TitleHeader title='Workspaces' element={<HeaderElement />} />
      <div className='grid grid-cols-3 gap-6'>
        {workspaces?.data?.map((workspace) => (
          <WorkspaceCard
            key={workspace.id}
            name={workspace.name}
            description={workspace.description}
            created_at={workspace.created_at}
            link={workspace.id}
          />
        ))}
      </div>
    </PageContainer>
  )
}

interface WorkspaceCardProps {
  name: string
  description: string | null
  created_at: Date
  link: string
}
function WorkspaceCard({ name, description, created_at, link }: WorkspaceCardProps) {
  return (
    <Link to={link} className='flex h-40 flex-col justify-between rounded-lg border bg-secondary p-4'>
      <div>
        <h3 className='mb-2 font-medium'>{name}</h3>
        <p className='text-sm text-muted-foreground'>{description || 'No description provided.'}</p>
      </div>
      <span className='text-xs text-muted-foreground'>{formatDate(created_at)}</span>
    </Link>
  )
}

function HeaderElement() {
  const navigate = useNavigate()
  return (
    <div className='flex items-center space-x-4'>
      <Button variant='outline' size='sm'>
        <PersonIcon className='h-4 w-4' />
        Join Workspace
      </Button>
      <Button
        onClick={() => {
          navigate('create')
        }}
        variant='default'
        size='sm'
      >
        <PlusIcon className='h-4 w-4' />
        Create Workspace
      </Button>
    </div>
  )
}
