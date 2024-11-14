import PageContainer from '@/components/shared/PageContainer'
import TitleHeader from '@/components/shared/TitleHeader'
import { Button } from '@/components/ui/button'
import { useGetPresignedURLs } from '@/services/useGetSignedURL'
import { useGetSingleProject } from '@/services/useGetSingleProject'
import { getFileWithPath } from '@/utils/fileUtils'
import axios from 'axios'
import { useCallback, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { File } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { formatDate } from '@/utils/utils'
import { Input } from '@/components/ui/input'

interface FileWithMetadata {
  file: File
  path: string // Path relative to the folder
}

const baseStyle = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
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

export default function ProjectDetails() {
  const { projectId, workspaceId } = useParams()

  const { data: projectData } = useGetSingleProject(projectId as string)
  const { mutate: mutatePresignedURLs, isPending: isUploading } = useGetPresignedURLs()

  const [files, setFiles] = useState<FileWithMetadata[]>([])

  const uploadFiles = () => {
    mutatePresignedURLs(
      {
        workspaceId: workspaceId!,
        bucketName: projectData?.data?.bucket_name as string,
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
                await axios.put(urlObj.url, file, {
                  headers: { 'Content-Type': file.type }
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
    const parentFolder = acceptedFiles?.[0]?.webkitRelativePath?.split('/')[0] || ''

    const processedFiles = getFileWithPath(acceptedFiles, parentFolder)

    setFiles(processedFiles)
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
    <PageContainer>
      <TitleHeader
        title={projectData?.data?.name || 'Project Name'}
        showBackBtn
        element={
          <div className='flex gap-2'>
            <Button variant='outline' size='sm'>
              deployment history
            </Button>
            <Button variant='outline' size='sm'>
              Instant rollback
            </Button>

            <Dialog onOpenChange={(open) => !open && setFiles([])}>
              <DialogTrigger>
                <Button variant='default' size='sm'>
                  Select files
                </Button>
              </DialogTrigger>
              <DialogContent className={`max-h-[500px] max-w-[600px] overflow-auto ${files.length > 0 ? 'pb-0' : ''}`}>
                <DialogHeader>
                  <DialogTitle>Selected Files</DialogTitle>
                </DialogHeader>

                {files.length > 0 ? (
                  <>
                    <div className='flex w-full items-center justify-between gap-2'>
                      <ul className='w-full'>
                        {files.map((file, index) => (
                          <li key={index} className='flex items-center gap-2'>
                            <File size={18} />
                            <div className='flex w-full items-center justify-between gap-4'>
                              <p>{file.file.name}</p>
                              <p className='text-sm'>{(file.file.size / 1024).toFixed(2)} KB</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className='sticky bottom-0 flex w-full items-center gap-4 bg-white py-6'>
                      <div className='flex-1'>
                        <Input placeholder='Deployment message' />
                      </div>
                      <Button className='' disabled={isUploading} variant='default' size='sm' onClick={uploadFiles}>
                        Upload files
                      </Button>
                    </div>
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
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      {projectData?.data && (
        <div className='grid grid-cols-2 gap-10 rounded-lg border p-10'>
          <div className='aspect-video w-full overflow-hidden rounded-lg'>
            <img src='/preview.png' className='h-full w-full object-cover' alt='' />
          </div>
          <div>
            <ul className='space-y-4'>
              <li>
                <p className='text-sm text-muted-foreground'>Bucket name</p>
                <p>{projectData?.data?.bucket_name}</p>
              </li>
              <li>
                <p className='text-sm text-muted-foreground'>Deployment URL</p>
                <a href={projectData?.data?.domain} target='_blank' className='text-blue-400 underline'>
                  {projectData?.data?.domain}
                </a>
              </li>
              <li>
                <p className='text-sm text-muted-foreground'>Created at</p>
                <p>{formatDate(projectData?.data?.created_at)}</p>
              </li>
              <li>
                <p className='text-sm text-muted-foreground'>Deployed by</p>
                <p>Mite Joshi</p>
              </li>
              <li>
                <p className='text-sm text-muted-foreground'>Deployment message</p>
                <p>projectData?.data?.created_by</p>
              </li>
            </ul>
          </div>
        </div>
      )}
    </PageContainer>
  )
}
