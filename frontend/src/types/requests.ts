export interface CreateWorkspaceRequest {
  name: string;
  company_name?: string;
  description?: string;
  created_by: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  service: "s3" | "lambda" | "ec2";
  created_by: string;
  provider?: "aws";
  workspace_id: string;
}
