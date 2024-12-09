import TitleHeader from '@/components/shared/TitleHeader'
import { Link, useNavigate, useParams } from 'react-router-dom'
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
import { SettingsIcon } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { useState } from 'react'

export default function ProjectList() {
  const [selectedItems, setSelectedItems] = useState<object[]>([])
  const { workspaceId } = useParams()
  const navigate = useNavigate()

  const { data: workspaceData } = useGetWorkspaceDetails(workspaceId as string)

  const isAllSelected =
    workspaceData?.data?.projects.length && selectedItems.length === workspaceData?.data?.projects.length

  const toggleRowSelection = (item: object) => {
    setSelectedItems((prev) => {
      if (prev.includes(item)) {
        return prev.filter((selected) => selected !== item)
      } else {
        return [...prev, item]
      }
    })
  }

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItems([])
    } else {
      setSelectedItems(workspaceData?.data?.projects || [])
    }
  }

  return (
    <PageContainer>
      <TitleHeader
        title={workspaceData?.data?.name || 'Workspace Name'}
        element={
          <div className='flex items-center gap-2'>
            <Link to='settings'>
              <Button variant={'outline'} size={'sm'}>
                <SettingsIcon />
                Settings
              </Button>
            </Link>
            <DeploymentDropdown />
          </div>
        }
      />

      <Table>
        <TableHeader>
          <TableRow className='font-medium'>
            <TableHead>
              <Checkbox checked={!!isAllSelected} onCheckedChange={toggleSelectAll} aria-label='Select All' />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Created by</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Region</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workspaceData?.data?.projects?.map((project, index) => (
            <TableRow className='h-[50px]' onClick={() => navigate(project.id)}>
              <TableCell>
                <Checkbox
                  onClick={(e) => e.stopPropagation()}
                  checked={selectedItems.includes(project)}
                  onCheckedChange={() => toggleRowSelection(project)}
                  aria-label={`Select Row ${index}`}
                />
              </TableCell>
              <TableCell>{project.name}</TableCell>
              <TableCell>{project.description || 'No description available'}</TableCell>
              <TableCell>{project.type}</TableCell>
              <TableCell>@{project.users.username}</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>{project.region}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* {workspaceData?.data?.projects.length ? (
        workspaceData?.data?.projects?.map((project) => (
          <ProjectCard
            key={project.id}
            name={project.name}
            description={project.description}
            created_at={project.created_at}
            link={project.id}
          />
        ))
      ) : (
        <div className='mt-[20%] flex flex-col items-center justify-center'>
          <img className='size-24 invert' src='/empty-folder.png' />
          No data available to display.
        </div>
      )} */}
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
              <GlobeAltIcon />
              <span>Static Website</span>
            </DropdownMenuItem>
          </Link>
          <Link to='create-lambda-function'>
            <DropdownMenuItem>
              <img className='size-4 mix-blend-difference invert' src='/lambda.png' alt='' />
              <span>Lambda Function</span>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem>
            <ServerStackIcon />
            <span>Elastic Compute Cloud</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CloudIcon />
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
