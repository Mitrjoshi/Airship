import { CustomFile, FileNode } from '@/types'

export function getProcessedFiles(selectedFiles: CustomFile[]): File[] {
  return selectedFiles.map((file) => {
    let originalPath = file.relativePath || file.path || ''

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

    // Manually set the `relativePath` field
    Object.defineProperty(updatedFile, 'relativePath', {
      value: file.relativePath,
      writable: true
    })

    return updatedFile
  })
}

export function buildFolderStructure(files: CustomFile[]): FileNode[] {
  const root: FileNode[] = []

  files.forEach((file) => {
    let originalPath: string = file.relativePath || file.path || ''
    if (originalPath.startsWith('/')) {
      originalPath = originalPath.slice(1)
    }
    const pathParts = originalPath.split('/')
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

export function formatFileSize(size: number): string {
  const KB = 1024
  const MB = KB * 1024
  const GB = MB * 1024
  const TB = GB * 1024

  switch (true) {
    case size < KB:
      return `${size} B`
    case size < MB:
      return `${(size / KB).toFixed(2)} KB`
    case size < GB:
      return `${(size / MB).toFixed(2)} MB`
    case size < TB:
      return `${(size / GB).toFixed(2)} GB`
    default:
      return `${(size / TB).toFixed(2)} TB`
  }
}
