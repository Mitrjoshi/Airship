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
import { ArrowUp, EllipsisIcon, SettingsIcon, Globe, MoveUpRight } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { useState } from 'react'
import { CustomSkeleton } from '@/components/shared/CustomSkeleton'

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

      {workspaceData?.data?.projects ? (
        <Table>
          <TableHeader>
            <TableRow className='font-medium hover:cursor-pointer'>
              <TableHead>
                <Checkbox checked={!!isAllSelected} onCheckedChange={toggleSelectAll} aria-label='Select All' />
              </TableHead>
              <TableHead className='flex items-center gap-2'>
                <p>Name</p>
                <ArrowUp className='size-4' />
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead className='max-w-32'>Status</TableHead>

              <TableHead className='flex items-center gap-2'>
                Created by
                <ArrowUp className='size-4' />
              </TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Region</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workspaceData?.data?.projects?.map((project, index) => (
              <TableRow className='h-[50px]'>
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
                    <p
                      onClick={() => navigate(project.id)}
                      className='cursor-pointer px-2 py-1 duration-200 hover:bg-red-500/80 hover:underline'
                    >
                      {project.name}
                    </p>
                  </div>
                </TableCell>
                <TableCell className='max-w-40'>
                  <p className='line-clamp-1 w-full'>{project.description || 'No description available'}</p>
                </TableCell>
                <TableCell className='mt-1.5 flex select-none items-center text-green-600'>
                  {['A', 'c', 't', 'i', 'v', 'e'].map((letter, index) => (
                    <p
                      className='animate-wave'
                      style={{
                        animationDelay: `${index * 100}ms`
                      }}
                    >
                      {letter}
                    </p>
                  ))}
                </TableCell>
                <TableCell>@{project.users.username}</TableCell>
                <TableCell>{project.type}</TableCell>

                <TableCell>{project.region}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <EllipsisIcon className='size-4' />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className='w-40'>
                      <DropdownMenuItem>
                        <MoveUpRight />
                        Move
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <SettingsIcon />
                        Settings
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className='mt-8 space-y-2'>
          <CustomSkeleton className='h-[30px] rounded-sm' />
          <CustomSkeleton className='h-[30px] rounded-sm' />
          <CustomSkeleton className='h-[30px] rounded-sm' />
          <CustomSkeleton className='h-[30px] rounded-sm' />
          <CustomSkeleton className='h-[30px] rounded-sm' />
          <CustomSkeleton className='h-[30px] rounded-sm' />
        </div>
      )}
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
