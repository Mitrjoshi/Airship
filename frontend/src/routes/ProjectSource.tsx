import { useGetFilesFromS3 } from '@/services/useGetFilesFromS3'
import { useGetSingleProject } from '@/services/useGetSingleProject'
import { GetFilesResponse } from '@/types/response'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export const ProjectSource = () => {
  const { projectId } = useParams()

  //states
  const [selectedFile, setSelectedFile] = useState<GetFilesResponse | null>(null)
  const [fileContent, setFileContent] = useState<string | null>(null)

  // api-hooks
  const { data: projectData } = useGetSingleProject(projectId as string)
  const { data: filesData } = useGetFilesFromS3({
    bucketName: projectData?.data?.bucket_name as string,
    region: projectData?.data?.region as string,
    workspaceId: projectData?.data?.workspace_id as string
  })

  useEffect(() => {
    if (!selectedFile) return

    const fetchFile = async () => {
      const fileUrl = selectedFile.url

      try {
        const response = await fetch(fileUrl)

        if (!response.ok) {
          throw new Error(`Error fetching file: ${response.statusText}`)
        }

        const content = await response.text()
        setFileContent(content)
      } catch (error) {
        console.error('Error fetching file:', error)
        setFileContent('Failed to fetch file content.')
      }
    }

    fetchFile()
  }, [selectedFile])

  return (
    <div className='flex h-screen items-start gap-4 overflow-hidden rounded-md border'>
      <div className='h-full w-full max-w-xs overflow-auto border-r p-4'>
        <h1 className='text-lg font-semibold'>Files</h1>
        <div>
          {filesData?.data?.map((item) => (
            <div
              onClick={() => setSelectedFile(item)}
              key={item.ETag}
              className='flex items-center justify-between gap-2 rounded-md p-2 duration-200 hover:bg-secondary'
            >
              <p className='text-sm'>{item.Key.split('/').pop()}</p>
            </div>
          ))}
        </div>
      </div>
      <div className='h-full w-full overflow-auto text-center'>
        <p className='text-left'>{fileContent}</p>
      </div>
    </div>
  )
}
