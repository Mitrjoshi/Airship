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
}
