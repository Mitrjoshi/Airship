import LoadingButton from '@/components/shared/LoadingButton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useGetSingleProject } from '@/services/useGetSingleProject'
import { useInvalidateCloudFront } from '@/services/useInvalidateCloudFront'
import { useUpdateProject } from '@/services/useUpdateProject'
import { CloudFrontDistributionConfig } from '@/types/response'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

export const ProjectConfiguration = () => {
  const { projectId } = useParams()

  //api hooks
  const { data: projectData, isRefetching } = useGetSingleProject(projectId as string)
  const { mutate: updateProjectMutate, isPending: isUpdatingProject } = useUpdateProject()
  const { mutate: mutateInvalidate, isPending: isInvalidating } = useInvalidateCloudFront()

  //state
  const [currentIndex, setCurrentIndex] = useState(0)

  //states
  const [newConfig, setNewConfig] = useState<CloudFrontDistributionConfig | undefined>(undefined)
  const [invalidationPath, setInvalidationPath] = useState<string>('')

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
    }
  ]

  const handleUpdateProject = () => {
    if (newConfig?.DefaultRootObject === '') {
      toast.error('The default root object is required')
      return
    }

    updateProjectMutate({
      distributionId: projectData?.data?.distribution_id as string,
      region: projectData?.data?.region as string,
      settings: newConfig as CloudFrontDistributionConfig,
      workspaceId: projectData?.data?.workspace_id as string
    })
  }

  useEffect(() => {
    if (!projectData) return
    if (!isRefetching) setNewConfig(projectData?.data?.cloudfrontConfig)
  }, [projectData, isRefetching])

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
                  onClick={handleUpdateProject}
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

          {currentIndex === 2 && (
            <>
              <div className='space-y-4 p-4'>
                <h1 className='text-lg font-semibold'>Create invalidation</h1>
                <p className='text-sm text-muted-foreground'>
                  Enter the file name of the object to remove from the cache. To clear all cache objects, use the
                  wildcard (*).
                </p>

                <Input
                  value={invalidationPath}
                  onChange={(e) => setInvalidationPath(e.target.value)}
                  placeholder='Example: index.html'
                />

                <div className='flex w-full justify-end gap-2'>
                  <LoadingButton
                    disabled={invalidationPath === '' || invalidationPath.startsWith('/')}
                    onClick={() => {
                      mutateInvalidate({
                        region: projectData?.data?.region as string,
                        workspaceId: projectData?.data?.workspace_id as string,
                        path: `/${invalidationPath}`,
                        distributionId: projectData?.data?.distribution_id as string
                      })
                    }}
                    isLoading={isInvalidating}
                    size={'sm'}
                  >
                    Invalidate
                  </LoadingButton>
                </div>
              </div>
            </>
          )}

          {currentIndex === 3 && (
            <>
              <div className='space-y-4 p-4'>
                <h1 className='text-lg font-semibold'>Caching Behavior</h1>
                <p className='text-sm text-muted-foreground'>
                  Time to Live (TTL) is the amount of time that CloudFront caches the file.
                </p>
                <div className='flex items-center justify-center gap-4 pt-4'>
                  <Label className='flex-1 space-y-2'>
                    <p className='font-semibold'>Minimum TTL</p>
                    <Input
                      type='number'
                      value={newConfig?.DefaultCacheBehavior?.MinTTL || ''}
                      onChange={(e) =>
                        setNewConfig({
                          ...newConfig,
                          DefaultCacheBehavior: {
                            ...newConfig?.DefaultCacheBehavior,
                            MinTTL: parseInt(e.target.value)
                          }
                        } as CloudFrontDistributionConfig)
                      }
                      placeholder='Minimum time to live in seconds.'
                    />
                  </Label>
                  <Label className='flex-1 space-y-2'>
                    <p className='font-semibold'>Maximum TTL</p>
                    <Input
                      type='number'
                      value={newConfig?.DefaultCacheBehavior?.MaxTTL || ''}
                      onChange={(e) =>
                        setNewConfig({
                          ...newConfig,
                          DefaultCacheBehavior: {
                            ...newConfig?.DefaultCacheBehavior,
                            MaxTTL: parseInt(e.target.value)
                          }
                        } as CloudFrontDistributionConfig)
                      }
                      placeholder='Maximum time to live in seconds.'
                    />
                  </Label>
                  <Label className='flex-1 space-y-2'>
                    <p className='font-semibold'>Default TTL</p>
                    <Input
                      type='number'
                      value={newConfig?.DefaultCacheBehavior?.DefaultTTL || ''}
                      onChange={(e) =>
                        setNewConfig({
                          ...newConfig,
                          DefaultCacheBehavior: {
                            ...newConfig?.DefaultCacheBehavior,
                            DefaultTTL: parseInt(e.target.value)
                          }
                        } as CloudFrontDistributionConfig)
                      }
                      placeholder='Default time to live in seconds.'
                    />
                  </Label>
                </div>
                <div className='flex w-full justify-end gap-2'>
                  <LoadingButton
                    isLoading={isUpdatingProject}
                    disabled={isUpdatingProject}
                    onClick={handleUpdateProject}
                    size={'sm'}
                  >
                    Save
                  </LoadingButton>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
