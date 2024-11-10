import PageContainer from '@/components/shared/PageContainer'
import TitleHeader from '@/components/shared/TitleHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useGetPresignedURLs } from '@/services/useGetSignedURL'
import { useGetSingleProject } from '@/services/useGetSingleProject'
import axios from 'axios'
import { ChangeEvent, useState } from 'react'
import { useParams } from 'react-router-dom'

interface FileWithMetadata {
  file: File
  path: string // Path relative to the folder
}

export default function ProjectDetails() {
  const { projectId, workspaceId } = useParams()
  const { data: projectData } = useGetSingleProject(projectId as string)
  const { mutate: mutatePresignedURLs, isPending: isUploading } = useGetPresignedURLs()

  const [files, setFiles] = useState<FileWithMetadata[]>([])

  // Handle folder selection and extract relative paths
  const handleFolderSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files
    if (!fileList) return

    const filesArray: FileWithMetadata[] = Array.from(fileList).map((file) => ({
      file,
      path: file.webkitRelativePath // Retain folder structure for S3
    }))

    setFiles(filesArray)
  }

  // Upload files to S3 using pre-signed URLs
  const uploadFiles = () => {
    mutatePresignedURLs(
      {
        workspaceId: workspaceId!,
        bucketName: projectData?.data?.bucket_name!,
        distFiles: files.map((f) => ({ path: f.path, type: f.file.type }))
      },
      {
        onSuccess: async (data) => {
          if (!data?.data) return
          const urls = data.data
          await Promise.all(
            files.map(async (fileWithMeta) => {
              const { file, path } = fileWithMeta
              const urlObj = urls.find((urlObj: { path: string }) => urlObj.path === path)

              if (urlObj) {
                // Use the pre-signed URL to upload the file
                await axios.put(urlObj.url, file, {
                  headers: { 'Content-Type': file.type }
                })
              }
            })
          )
        }
      }
    )
  }

  return (
    <PageContainer>
      <TitleHeader title={projectData?.data?.name || 'Project Name'} showBackBtn />

      <div className='flex items-center justify-center p-10'>
        <div>
          <Label htmlFor='folder'>Select Folder</Label>
          <Input
            id='folder'
            type='file'
            onChange={handleFolderSelect}
            multiple
            {...({ webkitdirectory: 'true', directory: 'true' } as any)}
          />
          <Button onClick={uploadFiles} disabled={isUploading || files.length === 0}>
            {isUploading ? 'Uploading...' : 'Upload Files'}
          </Button>
        </div>
      </div>
    </PageContainer>
  )
}
