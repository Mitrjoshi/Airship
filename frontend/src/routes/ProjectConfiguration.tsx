import { CachingBehaviorSettings } from '@/components/projects/staticWebsite/CachingBehaviorSettings'
import { DomainSettings } from '@/components/projects/staticWebsite/DomainSettings'
import { ErrorPagesSettings } from '@/components/projects/staticWebsite/ErrorPagesSettings'
import { GeneralSettings } from '@/components/projects/staticWebsite/GeneralSettings'
import { InvalidationSettings } from '@/components/projects/staticWebsite/InvalidationSettings'
import { useGetSingleProject } from '@/services/useGetSingleProject'
import { getProjectsResponse } from '@/types/response'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

export const ProjectConfiguration = () => {
  const { projectId } = useParams()

  //api hooks
  const { data: projectData, isRefetching } = useGetSingleProject(projectId as string)

  //state
  const [currentIndex, setCurrentIndex] = useState(1)

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

          {currentIndex === 1 && <DomainSettings projectData={projectData?.data as getProjectsResponse} />}

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
