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
  type: "static-website" | "lambda" | "ec2";
  created_by: string;
  workspace_id: string;
  region: string;
  distribution_id?: string;
  cloudfront_url?: string;
}

export interface DistFileData {
  path: string;
  type: string;
}
