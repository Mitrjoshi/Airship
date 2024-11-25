import LoadingButton from '@/components/shared/LoadingButton'
import { Button } from '@/components/ui/button'
import { FileNode } from '@/types'
import { formatFileSize } from '@/utils/fileUtils'
import { FolderIcon } from '@heroicons/react/24/solid'
import { ChevronDownIcon, FileTextIcon } from '@radix-ui/react-icons'
import { useState } from 'react'

interface I_Param {
  fileStructure: FileNode[]
  onUpload: () => void
  onCancel: () => void
  isGeneratingPresignedURLs: boolean
  uploadProgress: Record<string, number>
  isUploading: boolean
}

export default function FolderViewer({
  fileStructure,
  onUpload,
  onCancel,
  isUploading,
  uploadProgress,
  isGeneratingPresignedURLs
}: I_Param) {
  return (
    <div>
      <ul className='mb-6 rounded-lg border p-6 shadow-sm'>
        {fileStructure.map((folder, index) => (
          <Folder key={index} folder={folder} isUploading={isUploading} uploadProgress={uploadProgress} />
        ))}
      </ul>

      <div className='flex items-center justify-end gap-4'>
        <Button onClick={onCancel} variant='outline' size='sm'>
          Cancel
        </Button>
        <LoadingButton isLoading={isGeneratingPresignedURLs} onClick={onUpload} size='sm'>
          Upload
        </LoadingButton>
      </div>
    </div>
  )
}

function Folder({
  folder,
  uploadProgress,
  isUploading
}: {
  folder: FileNode
  isUploading: boolean
  uploadProgress: Record<string, number>
}) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <li className='my-1.5' key={folder.name}>
      <div className='flex w-full items-center justify-between gap-1.5'>
        <div className='flex items-center gap-1.5'>
          {folder.nodes && folder.nodes.length > 0 && (
            <button onClick={() => setIsOpen(!isOpen)}>
              <ChevronDownIcon className={`size-4 text-gray-500 ${!isOpen ? '-rotate-90' : ''}`} />
            </button>
          )}

          {folder.nodes ? (
            <FolderIcon className={`size-5 text-sky-500 ${folder.nodes.length === 0 ? 'ml-5' : ''}`} />
          ) : (
            <FileTextIcon className='h-4 w-4' strokeWidth={1.5} />
          )}
          {folder.name}
        </div>
        <div>
          {folder.count && folder.count > 0 && (
            <span className='text-xs font-medium text-gray-800'>({folder.count} items)</span>
          )}
          {folder.size && (
            <div className='flex items-center gap-4'>
              <span className='whitespace-nowrap text-right text-xs text-gray-500'>{formatFileSize(folder.size)}</span>
              {isUploading && (
                <div className='relative h-2.5 w-28 overflow-hidden rounded-full border'>
                  <span
                    className='absolute inset-0 bg-green-500'
                    style={{ width: `${uploadProgress[folder.name] || 0}%` }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <ul className='pl-6'>
          {folder.nodes?.map((subFolder) => (
            <Folder key={subFolder.name} folder={subFolder} isUploading={isUploading} uploadProgress={uploadProgress} />
          ))}
        </ul>
      )}
    </li>
  )
}
