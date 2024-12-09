import { Button } from '@/components/ui/button'
import { useGetWorkspaces } from '@/services/useGetWorkspaces'
import { Link, useNavigate } from 'react-router-dom'
import { formatDate } from '@/utils/utils'
import PageContainer from '@/components/shared/PageContainer'
import TitleHeader from '@/components/shared/TitleHeader'
import { CalendarIcon, PersonIcon, PlusIcon } from '@radix-ui/react-icons'
import { ChevronRight } from 'lucide-react'

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
    <Link
      to={link}
      className='group flex h-36 flex-col justify-between rounded-lg border p-4 duration-200 hover:border-gray-600 hover:bg-gray-900/50'
    >
      <div>
        <div className='mb-2 flex items-center justify-between'>
          <h3 className='font-medium'>{name}</h3>
          <ChevronRight className='size-5 text-muted-foreground transition-all duration-200 group-hover:translate-x-1 group-hover:scale-110 group-hover:text-primary' />
        </div>
        <p className='text-sm text-muted-foreground'>{description || 'No description provided.'}</p>
      </div>
      <div className='flex items-center text-muted-foreground'>
        <CalendarIcon className='mr-2 size-4' />
        <span className='text-xs'>{formatDate(created_at)}</span>
      </div>
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
