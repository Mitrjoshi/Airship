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
  workspace_id: string
  created_by: string
  bucket_name: string
  distribution_id: string
  cloudfront_url: string
  region: string
  cloudfrontConfig: CloudFrontDistributionConfig
  status: checkStatusResponse
  users: getUserDetaills
}

export type checkStatusResponse = 'InProgress' | 'Failed' | 'Deployed'

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

export interface CloudFrontDistributionConfig {
  CallerReference: string
  Aliases: {
    Quantity: number
  }
  DefaultRootObject: string
  Origins: {
    Quantity: number
    Items: Array<{
      Id: string
      DomainName: string
      OriginPath: string
      CustomHeaders: {
        Quantity: number
      }
      S3OriginConfig: {
        OriginAccessIdentity: string
      }
      ConnectionAttempts: number
      ConnectionTimeout: number
      OriginShield: {
        Enabled: boolean
      }
      OriginAccessControlId: string
    }>
  }
  OriginGroups: {
    Quantity: number
  }
  DefaultCacheBehavior: {
    TargetOriginId: string
    TrustedSigners: {
      Enabled: boolean
      Quantity: number
    }
    TrustedKeyGroups: {
      Enabled: boolean
      Quantity: number
    }
    ViewerProtocolPolicy: string
    AllowedMethods: {
      Quantity: number
      Items: string[]
      CachedMethods: {
        Quantity: number
        Items: string[]
      }
    }
    SmoothStreaming: boolean
    Compress: boolean
    LambdaFunctionAssociations: {
      Quantity: number
    }
    FunctionAssociations: {
      Quantity: number
    }
    FieldLevelEncryptionId: string
    ForwardedValues: {
      QueryString: boolean
      Cookies: {
        Forward: string
      }
      Headers: {
        Quantity: number
      }
      QueryStringCacheKeys: {
        Quantity: number
      }
    }
    MinTTL: number
    DefaultTTL: number
    MaxTTL: number
  }
  CacheBehaviors: {
    Quantity: number
  }
  CustomErrorResponses: {
    Quantity: number
  }
  Comment: string
  Logging: {
    Enabled: boolean
    IncludeCookies: boolean
    Bucket: string
    Prefix: string
  }
  PriceClass: string
  Enabled: boolean
  ViewerCertificate: {
    CloudFrontDefaultCertificate: boolean
    SSLSupportMethod: string
    MinimumProtocolVersion: string
    CertificateSource: string
  }
  Restrictions: {
    GeoRestriction: {
      RestrictionType: string
      Quantity: number
    }
  }
  WebACLId: string
  HttpVersion: string
  IsIPV6Enabled: boolean
  ContinuousDeploymentPolicyId: string
  Staging: boolean
}

export interface GetFilesResponse {
  Key: string
  LastModified: Date
  ETag: string
  Size: number
  StorageClass: string
  url: string
}
