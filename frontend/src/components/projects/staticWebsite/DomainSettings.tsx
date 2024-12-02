import LoadingButton from '@/components/shared/LoadingButton'
import { Button } from '@/components/ui/button'
import { getProjectsResponse } from '@/types/response'
import { UpdateIcon } from '@radix-ui/react-icons'
import { Check, Pen } from 'lucide-react'

export const DomainSettings = ({ projectData }: { projectData: getProjectsResponse }) => {
  return (
    projectData && (
      <>
        <div className='space-y-4 p-4'>
          <h1 className='text-lg font-semibold'>Domains</h1>
          <p className='text-sm text-muted-foreground'>
            These domains are assigned to your Production Deployments. Optionally, a different Git branch or a
            redirection to another domain can be configured for each one.
          </p>
          <div className='space-y-6 rounded-lg border p-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-4'>
                <p className='underline underline-offset-2'>
                  <a href={projectData?.cloudfront_url} target='_blank' rel='noreferrer'>
                    {projectData?.cloudfront_url}
                  </a>
                </p>
                <p className='rounded-full bg-blue-500 px-3 py-1 text-xs text-white'>Production</p>
              </div>
              <div className='flex items-center gap-4'>
                <LoadingButton isLoading={false} variant={'outline'} size={'sm'}>
                  <UpdateIcon />
                  Refresh
                </LoadingButton>
                <LoadingButton isLoading={false} variant={'outline'} size={'sm'}>
                  <Pen />
                  Edit
                </LoadingButton>
              </div>
            </div>

            <div className='flex items-center gap-4 text-sm'>
              <p className='flex items-center gap-2'>
                <span className='rounded-full bg-blue-500 p-0.5'>
                  <Check color='white' size={16} />
                </span>
                Valid Configuration
              </p>
              <p className='flex items-center gap-2'>
                <span className='rounded-full bg-blue-500 p-0.5'>
                  <Check color='white' size={16} />
                </span>
                Assigned to main
              </p>
            </div>
          </div>
          <div className='flex w-full justify-end gap-2'>
            <Button variant={'outline'} size={'sm'}>
              Add domain
            </Button>
          </div>
        </div>
      </>
    )
  )
}
