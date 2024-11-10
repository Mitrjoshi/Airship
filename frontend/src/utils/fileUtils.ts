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
