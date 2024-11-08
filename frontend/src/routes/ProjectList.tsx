import TitleHeader from '@/components/shared/TitleHeader'
import { Link, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'

import { useGetProjects } from '@/services/useGetProjects'
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

export default function ProjectList() {
  const { workspaceId } = useParams()

  const { data: projects } = useGetProjects(workspaceId as string)

  return (
    <PageContainer>
      <TitleHeader title={`Workspace: ${workspaceId}`} element={<DeploymentDropdown />} />
      <div className='mb-6 flex flex-wrap items-start justify-start gap-6'>
        {projects?.data?.map((project) => (
          <Link
            to={project.id}
            key={project.id}
            className='flex w-96 flex-col justify-between rounded-lg border bg-secondary p-4'
          >
            <h3 className='mb-2'>{project.name}</h3>
            <p className='mb-4 text-sm text-muted-foreground'>{project.description}</p>
            <span className='text-xs text-muted-foreground'>{formatDate(project.created_at)}</span>
          </Link>
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
