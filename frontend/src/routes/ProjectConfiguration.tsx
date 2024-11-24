import LoadingButton from '@/components/shared/LoadingButton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useGetSingleProject } from '@/services/useGetSingleProject'
import { useUpdateProject } from '@/services/useUpdateProject'
import { CloudFrontDistributionConfig } from '@/types/response'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export const ProjectConfiguration = () => {
  const { projectId } = useParams()

  //api hooks
  const { data: projectData } = useGetSingleProject(projectId as string)
  const { mutate: updateProjectMutate, isPending: isUpdatingProject } = useUpdateProject()

  //state
  const [currentIndex, setCurrentIndex] = useState(0)

  const [newConfig, setNewConfig] = useState<CloudFrontDistributionConfig | undefined>(undefined)

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
      text: 'Instant rollback'
    }
  ]

  useEffect(() => {
    if (!projectData) return

    setNewConfig(projectData?.data?.cloudfrontConfig)
  }, [projectData])

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
            <>
              <div className='space-y-4 rounded-lg border p-4'>
                <h1 className='text-lg font-semibold'>Project Name</h1>
                <p className='text-sm text-muted-foreground'>Used to identify your Project on the Dashboard.</p>
                <Input placeholder='Project Name' value={projectData?.data?.name} />
              </div>

              <div className='space-y-4 rounded-lg border p-4'>
                <h1 className='text-lg font-semibold'>Default Root Object</h1>
                <p className='text-sm text-muted-foreground'>
                  The object (file name) to return when a viewer requests the root URL (/) instead of a specific object.
                </p>
                <Input
                  onChange={(e) =>
                    setNewConfig({ ...newConfig, DefaultRootObject: e.target.value } as CloudFrontDistributionConfig)
                  }
                  placeholder='Default Root Object'
                  value={newConfig?.DefaultRootObject}
                />
              </div>

              <div className='flex w-full justify-end'>
                <LoadingButton
                  isLoading={isUpdatingProject}
                  disabled={isUpdatingProject}
                  onClick={() => {
                    updateProjectMutate({
                      distributionId: projectData?.data?.distribution_id as string,
                      region: projectData?.data?.region as string,
                      settings: newConfig as CloudFrontDistributionConfig,
                      workspaceId: projectData?.data?.workspace_id as string
                    })
                  }}
                  size={'sm'}
                >
                  Save
                </LoadingButton>
              </div>
            </>
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
        </div>
      </div>
    </>
  )
}
