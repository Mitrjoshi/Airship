import { CachingBehaviorSettings } from '@/components/projects/staticWebsite/CachingBehaviorSettings'
import { ErrorPagesSettings } from '@/components/projects/staticWebsite/ErrorPagesSettings'
import { GeneralSettings } from '@/components/projects/staticWebsite/GeneralSettings'
import { InvalidationSettings } from '@/components/projects/staticWebsite/InvalidationSettings'
import { Button } from '@/components/ui/button'
import { useGetSingleProject } from '@/services/useGetSingleProject'
import { getProjectsResponse } from '@/types/response'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

export const ProjectConfiguration = () => {
  const { projectId } = useParams()

  //api hooks
  const { data: projectData, isRefetching } = useGetSingleProject(projectId as string)

  //state
  const [currentIndex, setCurrentIndex] = useState(0)

  const ARRAY = [
    {
      text: 'General'
    },
    {
      text: 'Domains'
    },
    {
      text: 'Invalidations'
    },
    {
      text: 'Caching behaviors'
    },
    {
      text: 'Error pages'
    }
  ]

  return (
    <>
      <h1 className='border-b pb-4 text-3xl font-medium'>Project Configurations</h1>
      <div className='flex w-full space-x-4 rounded-lg py-4'>
        <div className='h-full w-full max-w-64'>
          <div className='flex flex-col gap-1'>
            {ARRAY.map((item, index) => (
              <button
                onClick={() => setCurrentIndex(index)}
                key={index}
                className={`flex items-center space-x-4 rounded-md p-2 duration-200 hover:bg-secondary ${currentIndex === index ? 'bg-secondary' : ''}`}
              >
                <p>{item.text}</p>
              </button>
            ))}
          </div>
        </div>

        <div className='w-full space-y-4'>
          {currentIndex === 0 && (
            <GeneralSettings isRefetching={isRefetching} projectData={projectData?.data as getProjectsResponse} />
          )}

          {currentIndex === 1 && (
            <>
              <div className='space-y-4 p-4'>
                <h1 className='text-lg font-semibold'>Domains</h1>
                <p className='text-sm text-muted-foreground'>
                  These domains are assigned to your Production Deployments. Optionally, a different Git branch or a
                  redirection to another domain can be configured for each one.
                </p>
                <div className='border p-4'>
                  <p>{projectData?.data?.cloudfront_url}</p>
                </div>
                <div className='flex w-full justify-end gap-2'>
                  <Button variant={'outline'} size={'sm'}>
                    Add domain
                  </Button>
                  <Button size={'sm'}>Save</Button>
                </div>
              </div>
            </>
          )}

          {currentIndex === 2 && <InvalidationSettings projectData={projectData?.data as getProjectsResponse} />}

          {currentIndex === 3 && (
            <CachingBehaviorSettings
              isRefetching={isRefetching}
              projectData={projectData?.data as getProjectsResponse}
            />
          )}

          {currentIndex === 4 && (
            <ErrorPagesSettings projectData={projectData?.data as getProjectsResponse} isRefetching={isRefetching} />
          )}
        </div>
      </div>
    </>
  )
}
