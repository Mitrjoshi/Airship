/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { useGetSignedURL } from '@/services/useGetSignedURL'
import { useGetSingleProject } from '@/services/useGetSingleProject'
import React from 'react'
import { useParams } from 'react-router-dom'

export default function ProjectDetails() {
  const { projectId } = useParams()
  const { toast } = useToast()

  const [selectedDirectory, setSelectedDirectory] = React.useState<{ file: File; path: any }[]>([])

  const { data } = useGetSingleProject(projectId as string)
  const { mutateAsync } = useGetSignedURL()

  const handleFileChange = (event: { target: { files: FileList | null } }) => {
    const files = event.target.files

    if (files) {
      const fileArray = Array.from(files).map((file) => ({
        file,
        path: (file as any).webkitRelativePath || file.name // Include the full path or fallback to file name
      }))

      const pathsValid = fileArray.every((fileEntry) => fileEntry.path !== null)

      if (!pathsValid) {
        console.error('Some file paths are null')
        toast({
          title: 'Error',
          description: 'Some file paths could not be determined. Please try again.'
        })
        return
      }

      setSelectedDirectory(fileArray)

      const hasIndexHtml = fileArray.some((fileEntry) => fileEntry.path.endsWith('index.html'))

      if (!hasIndexHtml) {
        return toast({
          title: 'Uh oh! index.html is missing.'
        })
      }
    }
  }

  const onSubmit = async () => {
    if (selectedDirectory.length === 0) {
      return toast({
        title: 'No files selected',
        description: 'Please select a directory to upload.'
      })
    }

    try {
      // Extract paths to send to the backend
      const filePaths = selectedDirectory.map((fileEntry) => fileEntry.path)

      console.log(filePaths)

      // Get signed URLs for all files
      const signedUrls = await mutateAsync({
        bucketName: data?.data?.bucket_name as string,
        workspaceId: data?.data?.workspace_id as string,
        fileKeys: filePaths
      })

      // Upload each file using its signed URL
      for (const fileEntry of selectedDirectory) {
        const { file, path } = fileEntry
        const url = signedUrls.data[path] // Use path to get the correct signed URL

        if (url) {
          await fetch(url, {
            method: 'PUT',
            body: file,
            headers: {
              'Content-Type': file.type || 'application/octet-stream'
            }
          })
        } else {
          console.warn(`No signed URL found for file: ${path}`)
        }
      }

      toast({
        title: 'Upload successful',
        description: 'All files were uploaded successfully.'
      })
    } catch (error) {
      console.error('Error uploading files:', error)
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading the files.'
      })
    }
  }

  return (
    <div>
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
    </div>
  )
}
