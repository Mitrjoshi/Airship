// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: {
    message: string
  }
}

export interface getUserDetaills {
  id: string
  username: string
}

export interface getProjectsResponse {
  id: string
  created_at: Date
  name: string
  description: null
  service: string
  provider: string
  workspace_id: string
  created_by: string
  bucket_name: string
  domain: string
  users: getUserDetaills
}

export interface getWorkspacesResponse {
  id: string
  created_at: Date
  name: string
  company_name: string | null
  description: string | null
  created_by: string
}

export interface WorkspaceDetailsResponse {
  created_at: Date
  name: string
  company_name: string
  description: string
  created_by: string
  id: string
  projects: getProjectsResponse[]
}

export interface PresignedUrlResponse {
  url: string
  path: string
}
