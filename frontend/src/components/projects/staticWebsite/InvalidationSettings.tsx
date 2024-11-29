import LoadingButton from '@/components/shared/LoadingButton'
import { Input } from '@/components/ui/input'
import { useInvalidateCloudFront } from '@/services/useInvalidateCloudFront'
import { getProjectsResponse } from '@/types/response'
import { useState } from 'react'

interface I_Request {
  projectData: getProjectsResponse
}

export const InvalidationSettings = ({ projectData }: I_Request) => {
  //api hooks
  const { mutate: mutateInvalidate, isPending: isInvalidating } = useInvalidateCloudFront()

  //states
  const [invalidationPath, setInvalidationPath] = useState<string>('')

  return (
    <>
      <div className='space-y-4 p-4'>
        <h1 className='text-lg font-semibold'>Create invalidation</h1>
        <p className='text-sm text-muted-foreground'>
          Enter the file name of the object to remove from the cache. To clear all cache objects, use the wildcard (*).
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
                region: projectData?.region as string,
                workspaceId: projectData?.workspace_id as string,
                path: `/${invalidationPath}`,
                distributionId: projectData?.distribution_id as string
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
  )
}
