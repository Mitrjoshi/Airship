import { useGetPresignedURLs } from '@/services/useGetSignedURL'
import { useParams } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import axios, { AxiosProgressEvent } from 'axios'
import { useCallback, useMemo, useState } from 'react'
import FolderViewer from './FileViewer'
import { useGetSingleProject } from '@/services/useGetSingleProject'
import { buildFolderStructure, getProcessedFiles } from '@/utils/fileUtils'
import { CustomFile } from '@/types'

export default function UploadFile() {
  const { workspaceId, projectId } = useParams()
  const { data: projectData } = useGetSingleProject(projectId as string)

  const { mutate: mutatePresignedURLs, isPending: isGeneratingPresignedURLs } = useGetPresignedURLs()

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
              console.log(fileWithMeta)

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
    padding: '20px',
    borderWidth: 2,
    borderRadius: 6,
    borderColor: '--border',
    borderStyle: 'dashed',
    backgroundColor: '--background',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out',
    height: 200,
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
    <div {...getRootProps({ style })}>
      <input id='folder' {...{ webkitdirectory: 'true', directory: 'true' }} {...getInputProps()} />
      {isDragActive ? <p>Drop the files here ...</p> : <p>Drag 'n' drop some files here, or click to select files</p>}
    </div>
  )
}
