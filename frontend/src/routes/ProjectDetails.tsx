import { Button } from '@/components/ui/button'
import { useGetDeploymentsByProjectId } from '@/services/useGetDeploymentsByProjectId'
import { useGetSingleProject } from '@/services/useGetSingleProject'
import { checkStatusResponse, DeploymentsResponse, getProjectsResponse } from '@/types/response'
import { formatDate } from '@/utils/utils'
import { useParams } from 'react-router-dom'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Calendar, CloudIcon, Copy, Cylinder, Globe, Link, MessageSquareText, UserRound } from 'lucide-react'
import { toast } from 'sonner'
import { CustomSkeleton } from '@/components/shared/CustomSkeleton'

export default function ProjectDetails() {
  const { projectId } = useParams()

  //api-hooks
  const { data: projectData } = useGetSingleProject(projectId as string)
  const { data: deploymentData } = useGetDeploymentsByProjectId(projectId as string)

  return (
    <>
      {projectData?.data && deploymentData?.data ? (
        <OverviewCard
          deploymentData={deploymentData?.data[0]}
          status={projectData?.data?.status as checkStatusResponse}
          projectData={projectData?.data as getProjectsResponse}
        />
      ) : (
        <CustomSkeleton className='h-48 w-full rounded-lg' />
      )}

      <div className='mt-8'>
        <h1 className='mb-2 text-lg font-semibold'>Deployments</h1>

        {deploymentData?.data && projectData ? (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='font-medium'>Sr. No.</TableHead>
                  <TableHead className='font-medium'>Deployed by</TableHead>
                  <TableHead className='font-medium'>Deployment id</TableHead>
                  <TableHead className='font-medium'>Deployment message</TableHead>
                  <TableHead className='text-right font-medium'>Deployed at</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deploymentData?.data?.map((deployment, index) => (
                  <>
                    <TableRow className='h-[50px]'>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className='flex items-center justify-start gap-2'>
                        <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-400 text-lg font-medium'>
                          {deployment.users.username.charAt(0)}
                        </div>
                        <p>{deployment.users.username}</p>
                      </TableCell>
                      <TableCell>{deployment?.id}</TableCell>
                      <TableCell>{deployment.deployment_msg}</TableCell>
                      <TableCell className='text-right'>{formatDate(deployment.created_at)}</TableCell>
                    </TableRow>
                  </>
                ))}
              </TableBody>
            </Table>

            <div className='mt-4 text-center'>
              <Button size='sm'>
                <p>View all...</p>
              </Button>
            </div>
          </>
        ) : (
          <div className='mt-8 space-y-2'>
            <CustomSkeleton className='h-[30px] rounded-sm' />
            <CustomSkeleton className='h-[30px] rounded-sm' />
            <CustomSkeleton className='h-[30px] rounded-sm' />
          </div>
        )}
      </div>
    </>
  )
}

interface OverviewCardProps {
  projectData: getProjectsResponse
  status: checkStatusResponse
  deploymentData: DeploymentsResponse
}

function OverviewCard({ projectData, status, deploymentData }: OverviewCardProps) {
  return (
    <div className='relative flex gap-6 rounded-lg border p-6 shadow-sm'>
      <div className='flex w-full items-start justify-between gap-10 text-sm'>
        <div className='space-y-4'>
          <div className='flex items-center gap-4 font-medium text-muted-foreground'>
            <div className='flex items-center gap-1.5'>
              <Globe size={16} />
              <p>Static website</p>
            </div>
            <p className='flex items-center gap-1.5'>
              {status === 'Failed' && (
                <>
                  <span className='h-2.5 w-2.5 rounded-full bg-red-500'></span>
                  <span>Failed</span>
                </>
              )}

              {status === 'InProgress' && (
                <>
                  <span className='h-2.5 w-2.5 rounded-full bg-yellow-500'></span>
                  <span>
                    {['D', 'e', 'p', 'l', 'o', 'y', 'i', 'n', 'g', '.', '.', '.'].map((item, i) => (
                      <span
                        className={`animate-wave`}
                        key={i}
                        style={{
                          animationDelay: `${i * 100}ms`
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </span>
                </>
              )}

              {status === 'Deployed' && (
                <>
                  <span className='h-2.5 w-2.5 animate-pulse rounded-full bg-green-500'></span>
                  <span>Live</span>
                </>
              )}
            </p>
          </div>

          <h1 className='text-4xl font-medium'>{projectData.name}</h1>

          <p className='text-muted-foreground'>
            <span className='font-medium'>{projectData.description}</span>
          </p>

          <div className='flex items-center gap-1.5 text-muted-foreground'>
            <Link size={16} className='shrink-0' />
            <a rel='noreferrer' target='_blank' className='text-blue-500 underline' href={projectData.cloudfront_url}>
              {projectData.cloudfront_url}
            </a>
            <button
              onClick={() => {
                navigator.clipboard.writeText(projectData.cloudfront_url)
                toast.success('Copied to clipboard')
              }}
            >
              <Copy size={16} className='shrink-0' />
            </button>
          </div>

          {deploymentData && (
            <div className='flex items-center gap-1.5 text-muted-foreground'>
              <MessageSquareText size={16} className='shrink-0' />
              <p>{deploymentData?.deployment_msg}</p>
            </div>
          )}
        </div>

        <div className='space-y-4 whitespace-nowrap'>
          {deploymentData && (
            <>
              <p className='flex items-center gap-1.5 text-muted-foreground'>
                <UserRound size={16} />
                Deployed by <span className='font-medium underline'>@{deploymentData?.users?.username}</span>
              </p>

              <p className='flex items-center gap-1.5 text-muted-foreground'>
                <Calendar size={16} />
                Deployed at
                <span className='font-medium'>{formatDate(deploymentData?.created_at)}</span>
              </p>
            </>
          )}

          <p className='flex items-center gap-1.5 text-muted-foreground'>
            <Cylinder size={16} />
            Bucket:{' '}
            <span className='font-medium underline'>
              <a href={`https://s3.console.aws.amazon.com/s3/buckets/${projectData.bucket_name}`}>
                {projectData.bucket_name}
              </a>
            </span>
          </p>
          <p className='flex items-center gap-1.5 text-muted-foreground'>
            <CloudIcon size={16} />
            Cloudfront:{' '}
            <span className='font-medium underline'>
              <a
                href={`https://console.aws.amazon.com/cloudfront/home?region=us-east-1#/distributions/${projectData.distribution_id}`}
              >
                {projectData.distribution_id}
              </a>
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
