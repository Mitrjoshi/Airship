import { FileNode } from '@/types'

export function getProcessedFiles(selectedFiles: File[]): File[] {
  const processedFiles = selectedFiles.map((file) => {
    let originalPath = file.webkitRelativePath || file.relativePath || file.path || ''

    if (originalPath?.startsWith('/')) {
      originalPath = originalPath.slice(1)
    }

    const relativePathParts = originalPath.split('/')
    if (relativePathParts.length > 1) {
      relativePathParts.shift()
    }

    const updatedPath = relativePathParts.join('/')

    // Create a new File object with the updated path
    const updatedFile = new File([file], file.name, {
      type: file.type,
      lastModified: file.lastModified
    })

    // Manually set the `webkitRelativePath` field
    Object.defineProperty(updatedFile, 'webkitRelativePath', {
      value: updatedPath,
      writable: true
    })

    return updatedFile
  })
  return processedFiles
}

export function buildFolderStructure(files: File[]): FileNode[] {
  const root: FileNode[] = []

  console.log('Files:', files)

  files?.forEach((file) => {
    let originalPath: string = file.webkitRelativePath || file.relativePath || file.path || ''
    if (originalPath?.startsWith('/')) {
      originalPath = originalPath?.slice(1)
    }
    const pathParts = originalPath?.split('/')
    let currentNode = root

    pathParts?.forEach((part, index) => {
      const isFile = index === pathParts.length - 1
      const node: FileNode = { name: part }

      if (isFile) {
        node.size = file.size
        currentNode.push(node)
      } else {
        let folderNode = currentNode?.find((n) => n.name === part)
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
