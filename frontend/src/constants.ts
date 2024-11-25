export const ServerRoutes = {
  workspace: {
    index: 'workspace',
    create: 'create',
    update: 'update',
    delete: 'delete',
    view: 'view',
    invite: 'invite',
    join: 'join'
  },
  user: {
    index: 'user',
    login: 'login',
    signup: 'signup',
    profile: 'profile',
    update: 'update',
    logout: 'logout'
  },
  projects: {
    index: 'projects',
    create: 'create',
    update: 'update',
    delete: 'delete',
    view: 'view',
    invite: 'invite',
    join: 'join'
  },
  provider: {
    index: '/provider',
    createSignedUrl: '/provider/create-signed-url',
    invalidateCloudFront: '/provider/invalidate',
    getS3Files: '/provider/get-files'
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
