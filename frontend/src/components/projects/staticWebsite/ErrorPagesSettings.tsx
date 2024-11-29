import LoadingButton from '@/components/shared/LoadingButton'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CloudFrontDistributionConfig, getProjectsResponse } from '@/types/response'
import { DialogClose } from '@radix-ui/react-dialog'
import { Pen, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'

interface I_Request {
  projectData: getProjectsResponse
  isRefetching: boolean
}

export const ErrorPagesSettings = ({ isRefetching, projectData }: I_Request) => {
  const [newConfig, setNewConfig] = useState<CloudFrontDistributionConfig | undefined>(undefined)
  const [selectedItems, setSelectedItems] = useState<object[]>([])

  useEffect(() => {
    if (!projectData) return
    if (!isRefetching) setNewConfig(projectData?.cloudfrontConfig)
  }, [projectData, isRefetching])

  const isAllSelected =
    newConfig?.CustomErrorResponses?.Items?.length &&
    selectedItems.length === newConfig.CustomErrorResponses.Items.length

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
      setSelectedItems(newConfig?.CustomErrorResponses?.Items || [])
    }
  }

  return (
    <div className='space-y-4 p-4'>
      <div className='flex items-center justify-between gap-2'>
        <h1 className='text-lg font-semibold'>Error pages</h1>

        <div className='flex items-center gap-2'>
          <Button disabled={selectedItems.length === 0} variant={'outline'} size={'sm'}>
            <Pen />
            Edit
          </Button>

          <Dialog>
            <DialogTrigger disabled={selectedItems.length === 0}>
              <Button disabled={selectedItems.length === 0} variant={'outline'} size={'sm'}>
                <Trash2 />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent className='max-w-sm'>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>This action cannot be undone.</DialogDescription>
              </DialogHeader>

              <div className='flex w-full items-center gap-2 border-t pt-5'>
                <DialogClose className='w-full flex-1'>
                  <Button className='w-full' size={'sm'}>
                    Cancel
                  </Button>
                </DialogClose>

                <LoadingButton className='w-full flex-1' variant={'destructive'} isLoading={false} size={'sm'}>
                  Delete
                </LoadingButton>
              </div>
            </DialogContent>
          </Dialog>

          <Button size={'sm'}>
            <Plus />
            Create
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className='text-center font-medium'>
            <TableHead>
              <Checkbox checked={!!isAllSelected} onCheckedChange={toggleSelectAll} aria-label='Select All' />
            </TableHead>
            <TableHead>HTTP error code</TableHead>
            <TableHead>Minimum TTL (seconds)</TableHead>
            <TableHead>Response page path</TableHead>
            <TableHead>HTTP response code</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {newConfig?.CustomErrorResponses?.Items?.map((item, index) => (
            <TableRow className='h-[50px]' key={index}>
              <TableCell>
                <Checkbox
                  checked={selectedItems.includes(item)}
                  onCheckedChange={() => toggleRowSelection(item)}
                  aria-label={`Select Row ${index}`}
                />
              </TableCell>
              <TableCell>{item.ErrorCode}</TableCell>
              <TableCell>{item.ErrorCachingMinTTL}</TableCell>
              <TableCell>{item.ResponsePagePath}</TableCell>
              <TableCell>{item.ResponseCode}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
