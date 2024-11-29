import LoadingButton from '@/components/shared/LoadingButton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUpdateProject } from '@/services/useUpdateProject'
import { CloudFrontDistributionConfig, getProjectsResponse } from '@/types/response'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface I_Request {
  projectData: getProjectsResponse
  isRefetching: boolean
}

export const CachingBehaviorSettings = ({ isRefetching, projectData }: I_Request) => {
  //api hooks
  const { mutate: updateProjectMutate, isPending: isUpdatingProject } = useUpdateProject()

  //states
  const [newConfig, setNewConfig] = useState<CloudFrontDistributionConfig | undefined>(undefined)

  const handleUpdateProject = () => {
    if (newConfig === projectData?.cloudfrontConfig) return

    if (newConfig?.DefaultRootObject === '') {
      toast.error('The default root object is required')
      return
    }

    updateProjectMutate({
      distributionId: projectData?.distribution_id as string,
      region: projectData?.region as string,
      settings: newConfig as CloudFrontDistributionConfig,
      workspaceId: projectData?.workspace_id as string
    })
  }

  useEffect(() => {
    if (!projectData) return
    if (!isRefetching) setNewConfig(projectData?.cloudfrontConfig)
  }, [projectData, isRefetching])

  return (
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
              value={newConfig?.DefaultCacheBehavior?.MinTTL}
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
              value={newConfig?.DefaultCacheBehavior?.MaxTTL}
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
              value={newConfig?.DefaultCacheBehavior?.DefaultTTL}
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
  )
}
