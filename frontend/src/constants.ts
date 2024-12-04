export const ServerRoutes = {
  workspace: {
    index: '/workspace',
    create: '/create',
    update: '/update',
    delete: '/delete',
    view: '/view',
    invite: '/invite',
    join: '/join'
  },
  auth: {
    index: '/auth',
    login: '/auth/login',
    signup: '/auth/signup',
    profile: '/profile',
    update: '/update',
    logout: '/logout'
  },
  projects: {
    index: '/projects',
    create: '/create',
    update: '/update',
    delete: '/projects/delete',
    view: '/view',
    invite: '/invite',
    join: '/join'
  },
  provider: {
    index: '/provider',
    createSignedUrl: '/provider/create-signed-url',
    invalidateCloudFront: '/provider/invalidate',
    getS3Files: '/provider/get-files'
  },
  deployments: {
    index: '/deployments',
    create: '/deployments/create'
  }
}

export const AWS_REGIONS = [
  {
    continent: 'North America',
    regions: [
      { code: 'us-east-1', city: 'N. Virginia' },
      { code: 'us-east-2', city: 'Ohio' },
      { code: 'us-west-1', city: 'N. California' },
      { code: 'us-west-2', city: 'Oregon' },
      { code: 'ca-central-1', city: 'Canada Central' }
    ]
  },
  {
    continent: 'South America',
    regions: [{ code: 'sa-east-1', city: 'São Paulo' }]
  },
  {
    continent: 'Europe',
    regions: [
      { code: 'eu-central-1', city: 'Frankfurt' },
      { code: 'eu-central-2', city: 'Zurich' },
      { code: 'eu-west-1', city: 'Ireland' },
      { code: 'eu-west-2', city: 'London' },
      { code: 'eu-west-3', city: 'Paris' },
      { code: 'eu-north-1', city: 'Stockholm' },
      { code: 'eu-south-1', city: 'Milan' },
      { code: 'eu-south-2', city: 'Spain' }
    ]
  },
  {
    continent: 'Asia Pacific',
    regions: [
      { code: 'ap-south-1', city: 'Mumbai' },
      { code: 'ap-south-2', city: 'Hyderabad' },
      { code: 'ap-south-3', city: 'Bangkok' },
      { code: 'ap-east-1', city: 'Hong Kong' },
      { code: 'ap-southeast-1', city: 'Singapore' },
      { code: 'ap-southeast-2', city: 'Sydney' },
      { code: 'ap-southeast-3', city: 'Jakarta' },
      { code: 'ap-southeast-4', city: 'Melbourne' },
      { code: 'ap-northeast-1', city: 'Tokyo' },
      { code: 'ap-northeast-2', city: 'Seoul' },
      { code: 'ap-northeast-3', city: 'Osaka' }
    ]
  },
  {
    continent: 'Middle East',
    regions: [
      { code: 'me-south-1', city: 'Bahrain' },
      { code: 'me-central-1', city: 'UAE' }
    ]
  },
  {
    continent: 'Africa',
    regions: [{ code: 'af-south-1', city: 'Cape Town' }]
  }
]

export const AWS_LAMBDA_RUNTIMES = [
  {
    language: 'Node.js',
    versions: [
      { runtime: 'nodejs18.x', description: 'Node.js 18.x' },
      { runtime: 'nodejs16.x', description: 'Node.js 16.x' }
    ]
  },
  {
    language: 'Python',
    versions: [{ runtime: 'python3.9', description: 'Python 3.9' }]
  },
  {
    language: 'Java',
    versions: [
      { runtime: 'java11', description: 'Java 11' },
      { runtime: 'java8.al2', description: 'Java 8 (Amazon Linux 2)' }
    ]
  },
  {
    language: 'Go',
    versions: [{ runtime: 'go1.x', description: 'Go 1.x' }]
  },
  {
    language: 'C# (.NET)',
    versions: [{ runtime: 'dotnet6', description: '.NET 6' }]
  },
  {
    language: 'Custom',
    versions: [
      { runtime: 'provided', description: 'Custom Runtime' },
      { runtime: 'provided.al2', description: 'Custom Runtime (Amazon Linux 2)' }
    ]
  }
]
