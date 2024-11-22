import { FileNode } from '@/types'

export function removeParentFolder(fullPath: string, parentFolder: string): string {
  const folderPrefix = `${parentFolder}/`

  if (fullPath.startsWith(folderPrefix)) {
    return fullPath.substring(folderPrefix.length)
  }
  return fullPath
}

export function getFileWithPath(selectedFiles: File[], parentFolder: string): { file: File; path: string }[] {
  return selectedFiles.map((file) => {
    const relativePath = file.webkitRelativePath
    const filePath = removeParentFolder(relativePath, parentFolder)
    return {
      file,
      path: filePath
    }
  })
}

export function buildFolderStructure(files: File[]): FileNode[] {
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
