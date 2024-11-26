import { useGetPresignedURLs } from '@/services/useGetSignedURL'
import { useParams } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import axios, { AxiosProgressEvent } from 'axios'
import { useCallback, useMemo, useState } from 'react'
import FolderViewer from './FileViewer'
import { useGetSingleProject } from '@/services/useGetSingleProject'
import { buildFolderStructure, getProcessedFiles } from '@/utils/fileUtils'
import { CustomFile } from '@/types'
import { toast } from 'sonner'
import { useCreateDeployment } from '@/services/useCreateDeployment'

export default function UploadFile() {
  const { workspaceId, projectId } = useParams()
  const { data: projectData } = useGetSingleProject(projectId as string)

  const { mutate: mutatePresignedURLs, isPending: isGeneratingPresignedURLs } = useGetPresignedURLs()
  const { mutate: mutateCreateDeployment } = useCreateDeployment()

  const [files, setFiles] = useState<CustomFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})

  const uploadFiles = () => {
    mutatePresignedURLs(
      {
        workspaceId: workspaceId!,
        bucketName: projectData?.data?.bucket_name as string,
        distFiles: files.map((file) => ({ path: file.webkitRelativePath, type: file.type })),
        region: projectData?.data?.region as string
      },
      {
        onSuccess: async (data) => {
          if (!data?.data) return
          const urls = data.data
          setIsUploading(true)
          await Promise.all(
            files.map(async (fileWithMeta) => {
              const urlObj = urls.find((urlObj: { path: string }) => urlObj.path === fileWithMeta.webkitRelativePath)

              if (urlObj) {
                await axios.put(urlObj.url, fileWithMeta, {
                  headers: { 'Content-Type': fileWithMeta.type },
                  onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                    if (progressEvent.total) {
                      const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                      setUploadProgress((prev) => ({ ...prev, [fileWithMeta.name]: progress }))
                    }
                  }
                })
              }
            })
          )
          mutateCreateDeployment({
            deployment_msg: 'Deployed',
            project_id: projectId as string
          })
          setFiles([])
          setIsUploading(false)
          setUploadProgress({})
        }
      }
    )
  }

  return (
    <>
      {files && files.length > 0 ? (
        <FolderViewer
          isGeneratingPresignedURLs={isGeneratingPresignedURLs}
          onUpload={uploadFiles}
          fileStructure={buildFolderStructure(files)}
          onCancel={() => setFiles([])}
          uploadProgress={uploadProgress}
          isUploading={isUploading}
        />
      ) : (
        <DragAndDrop setFiles={setFiles} />
      )}
    </>
  )
}

interface DragAndDropProps {
  setFiles: (files: File[]) => void
}
function DragAndDrop({ setFiles }: DragAndDropProps) {
  const baseStyle = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    borderRadius: 999,
    // backgroundColor: '#f5f5f5',
    color: '#bdbdbd',
    outline: 'none',
    justifyContent: 'center'
  }

  const focusedStyle = {
    borderColor: '#2196f3'
  }

  const acceptStyle = {
    borderColor: '#00e676'
  }

  const rejectStyle = {
    borderColor: '#ff1744'
  }
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const isValid = acceptedFiles.some((file) => file.name === 'index.html')
    if (!isValid) return toast.error('Please upload an index.html file')
    const newFiles = getProcessedFiles(acceptedFiles)
    setFiles(newFiles)
  }, [])

  const { getRootProps, getInputProps, isDragActive, isFocused, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: {
      file: []
    }
  })

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {})
    }),
    [isFocused, isDragAccept, isDragReject]
  )
  return (
    <div className='relative flex flex-col items-center justify-center p-10'>
      <div
        className={`group relative aspect-square h-72 w-72 select-none flex-col p-6 text-center duration-500 ${isDragActive ? 'scale-110' : ''}`}
        {...getRootProps({ style })}
      >
        <div className='spin-rotate absolute h-full w-full rounded-full border-4 border-dashed border-blue-500'></div>
        {isDragActive ? (
          <img
            className={`pointer-events-none mb-2 aspect-square max-w-20 ${isDragActive ? 'wiggle' : ''}`}
            src='/open-folder.png'
            alt=''
          />
        ) : (
          <img className='pointer-events-none mb-2 aspect-square max-w-20' src='/folder.png' alt='' />
        )}

        <input id='folder' {...{ webkitdirectory: 'true', directory: 'true' }} {...getInputProps()} />
        <p className='text-sm'>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <div className='mt-6 text-center font-medium'>
        <p>Drop a folder with your site’s HTML, CSS, and JS files.</p>
        <p>We’ll give you a link to share it.</p>
      </div>
    </div>
  )
}
