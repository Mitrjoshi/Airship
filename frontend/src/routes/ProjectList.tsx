import TitleHeader from '@/components/shared/TitleHeader'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
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
import { MoveDown, EllipsisIcon, SettingsIcon, Globe } from 'lucide-react'
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
          <TableRow className='font-medium hover:cursor-pointer'>
            <TableHead>
              <Checkbox checked={!!isAllSelected} onCheckedChange={toggleSelectAll} aria-label='Select All' />
            </TableHead>
            <TableHead className='flex items-center justify-between'>
              <p>Name</p>
              <MoveDown className='size-4' />
            </TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className='flex items-center justify-between'>
              Created by
              <MoveDown className='size-4' />
            </TableHead>
            <TableHead className='max-w-32'>Status</TableHead>
            <TableHead>Region</TableHead>
            <TableHead></TableHead>
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
              <TableCell>
                <div className='flex items-center gap-2'>
                  <Globe className='size-4' />
                  {project.name}
                </div>
              </TableCell>
              <TableCell>{project.description || 'No description available'}</TableCell>
              <TableCell>{project.type}</TableCell>
              <TableCell>@{project.users.username}</TableCell>
              <TableCell className='max-w-32 text-green-400'>Active</TableCell>
              <TableCell>{project.region}</TableCell>
              <TableCell className='w-10'>
                <Button onClick={(e) => e.stopPropagation()} variant={'ghost'} size={'icon'}>
                  <EllipsisIcon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
