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
  CallerReference: string // Required
  Aliases?: {
    Quantity: number // Required
    Items?: string[]
  }
  DefaultRootObject?: string
  Origins: {
    // Required
    Quantity: number // Required
    Items: Array<{
      Id: string // Required
      DomainName: string // Required
      OriginPath?: string
      CustomHeaders?: {
        Quantity: number // Required
        Items?: Array<{
          HeaderName: string // Required
          HeaderValue: string // Required
        }>
      }
      S3OriginConfig?: {
        OriginAccessIdentity: string // Required
      }
      CustomOriginConfig?: {
        HTTPPort: number // Required
        HTTPSPort: number // Required
        OriginProtocolPolicy: 'http-only' | 'https-only' | 'match-viewer' // Required
        OriginSslProtocols?: {
          Quantity: number // Required
          Items: Array<'SSLv3' | 'TLSv1' | 'TLSv1.1' | 'TLSv1.2'> // Required
        }
        OriginReadTimeout?: number
        OriginKeepaliveTimeout?: number
      }
      ConnectionAttempts?: number
      ConnectionTimeout?: number
      OriginShield?: {
        Enabled: boolean // Required
        OriginShieldRegion?: string
      }
    }>
  }
  OriginGroups?: {
    Quantity: number // Required
    Items?: Array<{
      Id: string // Required
      FailoverCriteria: {
        // Required
        StatusCodes: {
          Quantity: number // Required
          Items: number[] // Required
        }
      }
      Members: {
        // Required
        Quantity: number // Required
        Items: Array<{
          OriginId: string // Required
        }>
      }
    }>
  }
  DefaultCacheBehavior: {
    // Required
    TargetOriginId: string // Required
    TrustedSigners?: {
      Enabled: boolean // Required
      Quantity: number // Required
      Items?: string[]
    }
    TrustedKeyGroups?: {
      Enabled: boolean // Required
      Quantity: number // Required
      Items?: string[]
    }
    ViewerProtocolPolicy: 'allow-all' | 'https-only' | 'redirect-to-https' // Required
    AllowedMethods?: {
      Quantity: number // Required
      Items: Array<'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'OPTIONS' | 'DELETE'> // Required
      CachedMethods?: {
        Quantity: number // Required
        Items: Array<'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'OPTIONS' | 'DELETE'> // Required
      }
    }
    SmoothStreaming?: boolean
    Compress?: boolean
    LambdaFunctionAssociations?: {
      Quantity: number // Required
      Items?: Array<{
        LambdaFunctionARN: string // Required
        EventType: 'viewer-request' | 'viewer-response' | 'origin-request' | 'origin-response' // Required
        IncludeBody?: boolean
      }>
    }
    FieldLevelEncryptionId?: string
    RealtimeLogConfigArn?: string
    CachePolicyId?: string
    OriginRequestPolicyId?: string
    ForwardedValues?: {
      QueryString: boolean // Required
      Cookies: {
        // Required
        Forward: 'none' | 'whitelist' | 'all' // Required
        WhitelistedNames?: {
          Quantity: number // Required
          Items?: string[]
        }
      }
      Headers?: {
        Quantity: number // Required
        Items?: string[]
      }
      QueryStringCacheKeys?: {
        Quantity: number // Required
        Items?: string[]
      }
    }
    MinTTL?: number
    DefaultTTL?: number
    MaxTTL?: number
  }
  CacheBehaviors?: {
    Quantity: number // Required
    Items?: Array<{
      PathPattern: string // Required
      TargetOriginId: string // Required
      TrustedSigners?: {
        Enabled: boolean // Required
        Quantity: number // Required
        Items?: string[]
      }
      TrustedKeyGroups?: {
        Enabled: boolean // Required
        Quantity: number // Required
        Items?: string[]
      }
      ViewerProtocolPolicy: 'allow-all' | 'https-only' | 'redirect-to-https' // Required
      AllowedMethods?: {
        Quantity: number // Required
        Items: Array<'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'OPTIONS' | 'DELETE'> // Required
        CachedMethods?: {
          Quantity: number // Required
          Items: Array<'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'OPTIONS' | 'DELETE'> // Required
        }
      }
      SmoothStreaming?: boolean
      Compress?: boolean
      LambdaFunctionAssociations?: {
        Quantity: number // Required
        Items?: Array<{
          LambdaFunctionARN: string // Required
          EventType: 'viewer-request' | 'viewer-response' | 'origin-request' | 'origin-response' // Required
          IncludeBody?: boolean
        }>
      }
      FieldLevelEncryptionId?: string
      RealtimeLogConfigArn?: string
      CachePolicyId?: string
      OriginRequestPolicyId?: string
      ForwardedValues?: {
        QueryString: boolean // Required
        Cookies: {
          // Required
          Forward: 'none' | 'whitelist' | 'all' // Required
          WhitelistedNames?: {
            Quantity: number // Required
            Items?: string[]
          }
        }
        Headers?: {
          Quantity: number // Required
          Items?: string[]
        }
        QueryStringCacheKeys?: {
          Quantity: number // Required
          Items?: string[]
        }
      }
      MinTTL?: number
      DefaultTTL?: number
      MaxTTL?: number
    }>
  }
  CustomErrorResponses?: {
    Quantity: number // Required
    Items?: Array<{
      ErrorCode: number // Required
      ResponsePagePath?: string
      ResponseCode?: string
      ErrorCachingMinTTL?: number
    }>
  }
  Comment: string // Required
  Logging?: {
    Enabled: boolean // Required
    IncludeCookies: boolean // Required
    Bucket: string // Required
    Prefix: string // Required
  }
  PriceClass?: 'PriceClass_100' | 'PriceClass_200' | 'PriceClass_All'
  Enabled: boolean // Required
  ViewerCertificate?: {
    CloudFrontDefaultCertificate?: boolean
    IAMCertificateId?: string
    ACMCertificateArn?: string
    SSLSupportMethod?: 'sni-only' | 'vip' | 'static-ip'
    MinimumProtocolVersion?: 'SSLv3' | 'TLSv1' | 'TLSv1_2016' | 'TLSv1.1_2016' | 'TLSv1.2_2018' | 'TLSv1.2_2019'
    Certificate?: string
    CertificateSource?: 'cloudfront' | 'iam' | 'acm'
  }
  Restrictions?: {
    GeoRestriction: {
      RestrictionType: 'blacklist' | 'whitelist' | 'none' // Required
      Quantity: number // Required
      Items?: string[]
    }
  }
  WebACLId?: string
  HttpVersion?: 'http1.1' | 'http2'
  IsIPV6Enabled?: boolean
}

export interface GetFilesResponse {
  Key: string
  LastModified: Date
  ETag: string
  Size: number
  StorageClass: string
  url: string
}

export interface DeploymentsResponse {
  id: string
  created_at: Date
  project_id: string
  deployed_by: string
  deployment_msg: string
  users: getUserDetaills
}
