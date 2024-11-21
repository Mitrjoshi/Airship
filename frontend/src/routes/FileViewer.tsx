import { Button } from '@/components/ui/button'
import { FolderIcon } from '@heroicons/react/24/solid'
import { ChevronDownIcon, FileTextIcon } from '@radix-ui/react-icons'
import React, { useEffect, useState } from 'react'

interface FileNode {
  name: string
  size?: number
  count?: number
  nodes?: FileNode[]
}

interface I_Param {
  selectedFile: File[]
  upload: () => void
}

export default function FolderViewer({ selectedFile, upload }: I_Param) {
  const [fileStructure, setFileStructure] = useState<FileNode[]>([])

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

  useEffect(() => {
    if (!selectedFile) return

    const selectedFiles = Array.from(selectedFile || [])
    const folderStructure = buildFolderStructure(selectedFiles)
    setFileStructure(folderStructure)
  }, [selectedFile])

  return (
    <div className='mx-auto max-w-3xl p-8'>
      <ul>
        {fileStructure.map((folder, index) => (
          <Folder key={index} folder={folder} />
        ))}
      </ul>
      <Button onClick={upload} size={'sm'} className='w-full'>
        Upload
      </Button>
    </div>
  )
}

function Folder({ folder }: { folder: FileNode }) {
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
