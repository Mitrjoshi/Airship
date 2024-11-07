// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    message: string;
  };
}

export interface getProjectsResponse {
  id: string;
  created_at: Date;
  name: string;
  description: null;
  service: string;
  provider: string;
  workspace_id: string;
  created_by: string;
  domain: string;
}

export interface getWorkspacesResponse {
  id: string;
  created_at: Date;
  name: string;
  company_name: string | null;
  description: string | null;
  created_by: string;
}
