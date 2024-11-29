import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { useDeleteProject } from '@/services/useDeleteProject'
import { useEffect, useState } from 'react'
import { Input } from '../../ui/input'
import LoadingButton from '../../shared/LoadingButton'
import { Button } from '../../ui/button'
import { toast } from 'sonner'
import { useUpdateProject } from '@/services/useUpdateProject'
import { CloudFrontDistributionConfig, getProjectsResponse } from '@/types/response'

interface I_Request {
  projectData: getProjectsResponse
  isRefetching: boolean
}

export const GeneralSettings = ({ projectData, isRefetching }: I_Request) => {
  //api hooks
  const { mutate: deleteProjectMutate, isPending: isDeletingProject } = useDeleteProject()
  const { mutate: updateProjectMutate, isPending: isUpdatingProject } = useUpdateProject()

  //states
  const [deleteCommand, setDeleteCommand] = useState<string>('')
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
      <div className='space-y-4 rounded-lg border'>
        <div className='space-y-2 p-4'>
          <h1 className='text-lg font-semibold'>Project Name</h1>
          <p className='text-sm text-muted-foreground'>Used to identify your Project on the Dashboard.</p>
          <Input placeholder='Project Name' value={projectData?.name} />
        </div>

        <div className='flex w-full justify-end border-y p-4'>
          <LoadingButton
            isLoading={isUpdatingProject}
            disabled={isUpdatingProject}
            onClick={handleUpdateProject}
            size={'sm'}
          >
            Save
          </LoadingButton>
        </div>

        <div className='space-y-2 p-4'>
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

        <div className='flex w-full justify-end border-t p-4'>
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

      <div className='space-y-4 rounded-lg border border-red-500 p-4'>
        <h1 className='text-lg font-semibold'>Delete Project</h1>
        <p className='text-sm text-muted-foreground'>
          The project will be permanently deleted, including its deployments and domains. This action is irreversible
          and can not be undone.
        </p>

        <div className='flex w-full justify-end'>
          <Dialog>
            <DialogTrigger asChild>
              <Button disabled={!projectData} variant={'destructive'} className='bg-red-500' size={'sm'}>
                Delete Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className='mb-4'>Delete Project</DialogTitle>
                <DialogDescription>This action cannot be undone.</DialogDescription>
                <DialogDescription>Are you sure you want to delete this Project?</DialogDescription>
                <DialogDescription>
                  Type <span className='font-semibold'>sudo delete {projectData?.name}</span> below to confirm.
                </DialogDescription>
              </DialogHeader>
              <div className='grid gap-4 py-4'>
                <Input onChange={(e) => setDeleteCommand(e.target.value)} className='col-span-3' />
              </div>
              <DialogFooter>
                <DialogClose>
                  <Button variant={'outline'} size={'sm'}>
                    Cancel
                  </Button>
                </DialogClose>
                <LoadingButton
                  disabled={deleteCommand !== `sudo delete ${projectData?.name}` || isDeletingProject}
                  size={'sm'}
                  variant={'destructive'}
                  onClick={() => {
                    if (deleteCommand !== `sudo delete ${projectData?.name}`) {
                      toast.error('Invalid command.')
                      return
                    }

                    deleteProjectMutate({
                      workspaceId: projectData?.workspace_id as string,
                      projectId: projectData?.id as string,
                      region: projectData?.region as string,
                      distributionId: projectData?.distribution_id as string,
                      bucketName: projectData?.bucket_name as string
                    })
                  }}
                  isLoading={isDeletingProject}
                  type='submit'
                >
                  Delete Project
                </LoadingButton>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  )
}
