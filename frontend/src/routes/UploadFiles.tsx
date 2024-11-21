import { useGetPresignedURLs } from '@/services/useGetSignedURL'
import { useParams } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'
import { useCallback, useMemo, useState } from 'react'
import FolderViewer from './FileViewer'
import { useGetSingleProject } from '@/services/useGetSingleProject'

// interface FileWithMetadata {
//   file: File
//   path: string // Path relative to the folder
// }

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

export default function UploadFile() {
  const { workspaceId, projectId } = useParams()
  const { data: projectData } = useGetSingleProject(projectId as string)

  const { mutate: mutatePresignedURLs } = useGetPresignedURLs()

  const [files, setFiles] = useState<File[]>([])

  const uploadFiles = () => {
    mutatePresignedURLs(
      {
        workspaceId: workspaceId!,
        bucketName: projectData?.data?.bucket_name as string,
        distFiles: files.map((f) => ({ path: f.webkitRelativePath, type: f.type })),
        region: projectData?.data?.region as string
      },
      {
        onSuccess: async (data) => {
          if (!data?.data) return
          const urls = data.data
          await Promise.all(
            files.map(async (fileWithMeta) => {
              const { webkitRelativePath } = fileWithMeta
              const urlObj = urls.find((urlObj: { path: string }) => urlObj.path === webkitRelativePath)

              if (urlObj) {
                await axios.put(urlObj.url, fileWithMeta, {
                  headers: { 'Content-Type': fileWithMeta.type }
                })
              }
            })
          )

          setFiles([])
        }
      }
    )
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles)
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
    <>
      {files && files.length > 0 ? (
        <>
          <FolderViewer upload={uploadFiles} selectedFile={files} />
        </>
      ) : (
        <div {...getRootProps({ style })}>
          <input id='folder' {...{ webkitdirectory: 'true', directory: 'true' }} {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop some files here, or click to select files</p>
          )}
        </div>
      )}
    </>
  )
}
