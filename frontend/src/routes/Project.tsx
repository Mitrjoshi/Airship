import PageContainer from '@/components/shared/PageContainer'
import TitleHeader from '@/components/shared/TitleHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { useGetSignedURL } from '@/services/useGetSignedURL'
import { useGetSingleProject } from '@/services/useGetSingleProject'
import { useParams } from 'react-router-dom'

export default function ProjectDetails() {
  const { projectId } = useParams()
  const { toast } = useToast()

  const { data } = useGetSingleProject(projectId as string)
  const { mutate } = useGetSignedURL()

  const handleFileChange = (event: { target: { files: any } }) => {
    const files = event.target.files

    if (files) {
      console.log('Selected files:', files)

      // Check if index.html exists
      const hasIndexHtml = Array.from(files).some(
        //@ts-expect-error
        (file) => file.name === 'index.html'
      )

      if (!hasIndexHtml)
        return toast({
          title: 'Uh oh! index.html is missing.'
        })
    }
  }

  const onSubmit = () => {
    mutate(
      {
        bucketName: data?.data?.bucket_name!,
        workspaceId: data?.data?.workspace_id!
      },
      {
        onSuccess: (data) => {}
      }
    )
  }

  return (
    <PageContainer>
      <TitleHeader title={data?.data?.name || 'Project Name'} showBackBtn />

      <div className='flex items-center justify-center p-10'>
        <div>
          <Label htmlFor='folder'>Select Folder</Label>
          <Input
            id='folder'
            type='file'
            onChange={handleFileChange}
            multiple
            {...({ webkitdirectory: 'true', directory: 'true' } as any)}
          />
          <Button onClick={onSubmit}>Upload</Button>
        </div>
      </div>
    </PageContainer>
  )
}
