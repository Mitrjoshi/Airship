export interface FileNode {
  name: string
  size?: number
  count?: number
  nodes?: FileNode[]
}

export interface CustomFile extends File {
  relativePath?: string
  path?: string
}
