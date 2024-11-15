import { CodeXml, FileSpreadsheet } from 'lucide-react'
import React, { useState } from 'react'

interface FileNode {
  name: string
  size?: number
  count?: number
  nodes?: FileNode[]
}

export default function FolderViewer() {
  const [fileStructure, setFileStructure] = useState<FileNode[]>([])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])
    const folderStructure = buildFolderStructure(selectedFiles)
    setFileStructure(folderStructure)
  }

  const buildFolderStructure = (files: File[]): FileNode[] => {
    const root: FileNode[] = []

    files.forEach((file) => {
      const pathParts = file.webkitRelativePath.split('/')
      let currentNode = root

      pathParts.forEach((part, index) => {
        const isFile = index === pathParts.length - 1
        const node: FileNode = { name: part }

        if (isFile) {
          node.size = file.size
          currentNode.push(node)
        } else {
          let folderNode = currentNode.find((n) => n.name === part)
          if (!folderNode) {
            folderNode = { name: part, nodes: [], count: 0 }
            currentNode.push(folderNode)
          }
          folderNode.count = (folderNode.count || 0) + 1
          currentNode = folderNode.nodes!
        }
      })
    })

    return root
  }

  return (
    <div>
      <input type='file' {...{ webkitdirectory: 'true', directory: 'true' }} onChange={handleFileSelect} />
      <ul className='mx-auto max-w-3xl p-8'>
        {fileStructure.map((folder, index) => (
          <Folder key={index} folder={folder} />
        ))}
      </ul>
    </div>
  )
}

function Folder({ folder }: { folder: FileNode }) {
  const [isOpen, setIsOpen] = useState(true)
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()

    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return '🖼'
      case 'pdf':
        return '📄'
      case 'doc':
      case 'docx':
        return '📃'

      case 'mp3':
      case 'wav':
        return '🎵'
      case 'mp4':
      case 'avi':
      case 'mkv':
        return '🎥'
      case 'zip':
      case 'rar':
        return '📦'
      default:
        return '📄'
    }
  }

  return (
    <li className='my-1.5' key={folder.name}>
      <div className='flex w-full items-center justify-between gap-1.5'>
        <div className='flex items-center gap-1.5'>
          {folder.nodes && folder.nodes.length > 0 && (
            <button onClick={() => setIsOpen(!isOpen)}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
                fill='currentColor'
                className={`size-4 text-gray-500 ${isOpen ? 'rotate-90' : ''}`}
              >
                <path
                  fillRule='evenodd'
                  d='M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z'
                  clipRule='evenodd'
                />
              </svg>
            </button>
          )}

          {folder.nodes ? (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className={`size-5 text-sky-500 ${folder.nodes.length === 0 ? 'ml-5' : ''}`}
            >
              <path d='M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z' />
            </svg>
          ) : (
            <span className='ml-5 size-5 text-gray-950'>{getFileIcon(folder.name)}</span>
          )}
          {folder.name}
        </div>
        <div>
          {folder.count !== undefined && folder.count > 0 && (
            <span className='ml-2 text-xs font-medium text-gray-800'>({folder.count} items)</span>
          )}
          {folder.size !== undefined && (
            <span className='ml-2 text-xs text-gray-500'>{(folder.size / 1024).toFixed(2)} KB</span>
          )}
        </div>
      </div>

      {isOpen && (
        <ul className='pl-6'>{folder.nodes?.map((subFolder) => <Folder key={subFolder.name} folder={subFolder} />)}</ul>
      )}
    </li>
  )
}
