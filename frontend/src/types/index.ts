export interface FileNode {
  name: string
  size?: number
  count?: number
  nodes?: FileNode[]
}
