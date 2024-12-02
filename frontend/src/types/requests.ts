export interface CreateWorkspaceRequest {
  name: string
  company_name?: string
  description?: string
  access_key: string
  secret_key: string
}

export interface CreateProjectRequest {
  name: string
  bucket_name: string
  description?: string
  type: 'static-website' | 'lambda' | 'ec2'
  created_by: string
  workspace_id: string
  region: string
  environment: 'staging' | 'production'
}
