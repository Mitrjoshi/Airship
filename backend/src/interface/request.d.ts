export interface I_CREATE_INTERFACE_BODY {
  name: string;
  company_name: string;
  description: string;
  created_by: string;
  access_key: string;
  secret_key: string;
  region: string;
}

export interface CreateProjectRequest {
  name: string;
  bucket_name: string;
  description?: string;
  service: "s3" | "lambda" | "ec2";
  created_by: string;
  provider?: "aws";
  workspace_id: string;
  domain: string;
}

export interface DistFileData {
  path: string;
  type: string;
}
