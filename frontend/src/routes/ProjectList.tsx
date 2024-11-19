import TitleHeader from '@/components/shared/TitleHeader'
import { Link, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/utils/utils'
import { ChevronDownIcon } from '@radix-ui/react-icons'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { CloudIcon, GlobeAltIcon, ServerStackIcon } from '@heroicons/react/24/outline'
import PageContainer from '@/components/shared/PageContainer'
import { useGetWorkspaceDetails } from '@/services/useGetWorkspaceDetails'

export default function ProjectList() {
  const { workspaceId } = useParams()

  const { data: workspaceData } = useGetWorkspaceDetails(workspaceId as string)

  return (
    <PageContainer>
      <TitleHeader title={workspaceData?.data?.name || 'Workspace Name'} showBackBtn element={<DeploymentDropdown />} />
      <div className='grid grid-cols-3 gap-6'>
        {workspaceData?.data?.projects?.map((project) => (
          <ProjectCard
            key={project.id}
            name={project.name}
            description={project.description}
            created_at={project.created_at}
            link={project.id}
          />
        ))}
      </div>
    </PageContainer>
  )
}

function DeploymentDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='default' size='sm'>
          Add New... <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Deployment Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link to='create-static-website'>
            <DropdownMenuItem>
              <GlobeAltIcon strokeWidth={2} />
              <span>Static Website</span>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem>
            <img className='size-4 mix-blend-difference invert' src='/lambda.png' alt='' />
            <span>Lambda Function</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ServerStackIcon strokeWidth={2} />
            <span>Elastic Compute Cloud</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CloudIcon strokeWidth={2} />
            <span>Content Delivery Network</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface ProjectCardProps {
  name: string
  description: string | null
  created_at: Date
  link: string
}
function ProjectCard({ name, description, created_at, link }: ProjectCardProps) {
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
