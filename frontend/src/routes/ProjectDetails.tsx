import { Button } from '@/components/ui/button'
import { useGetDeploymentsByProjectId } from '@/services/useGetDeploymentsByProjectId'
import { useGetSingleProject } from '@/services/useGetSingleProject'
import { checkStatusResponse, DeploymentsResponse, getProjectsResponse } from '@/types/response'
import { formatDate } from '@/utils/utils'
import { useParams } from 'react-router-dom'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function ProjectDetails() {
  const { projectId } = useParams()

  //api-hooks
  const { data: projectData } = useGetSingleProject(projectId as string)
  const { data: deploymentData } = useGetDeploymentsByProjectId(projectId as string)

  return (
    projectData &&
    deploymentData?.data && (
      <>
        <OverviewCard
          deploymentData={deploymentData?.data[0]}
          status={projectData?.data?.status as checkStatusResponse}
          projectData={projectData?.data}
        />

        {deploymentData?.data && deploymentData?.data?.length > 0 && (
          <div className='mt-8'>
            <h1 className='mb-2 text-lg font-semibold'>Deployments</h1>

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
                    <TableRow>
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

            <div className='text-center'>
              <Button size='sm'>
                <p>View all...</p>
              </Button>
            </div>
          </div>
        )}
      </>
    )
  )
}

interface OverviewCardProps {
  projectData: getProjectsResponse | undefined
  status: checkStatusResponse
  deploymentData: DeploymentsResponse
}

function OverviewCard({ projectData, status, deploymentData }: OverviewCardProps) {
  return (
    projectData && (
      <div className='relative flex gap-6 rounded-lg border p-6 shadow-sm'>
        <div className='aspect-video h-auto w-full max-w-md rounded-lg bg-secondary'></div>
        <ul className='relative space-y-4 text-sm'>
          <li>
            <p className='text-muted-foreground'>Bucket name</p>
            <p>{projectData?.bucket_name}</p>
          </li>
          <li>
            <p className='text-muted-foreground'>Deployment URL</p>
            <a href={projectData?.cloudfront_url} target='_blank' className='text-blue-400 underline'>
              {projectData?.cloudfront_url}
            </a>
          </li>
          <li className='flex gap-6'>
            <div>
              <p className='text-muted-foreground'>Status</p>
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
                    <span>Deploying</span>
                  </>
                )}

                {status === 'Deployed' && (
                  <>
                    <span className='h-2.5 w-2.5 rounded-full bg-green-500'></span>
                    <span>Ready</span>
                  </>
                )}
              </p>
            </div>
            {deploymentData && (
              <div>
                <p className='text-muted-foreground'>Deployed</p>
                <p>
                  at {formatDate(deploymentData?.created_at as Date)} by{' '}
                  <span className='cursor-pointer font-semibold duration-150'>@{deploymentData?.users.username}</span>
                </p>
              </div>
            )}
          </li>
          {deploymentData && (
            <>
              <li>
                <p className='text-muted-foreground'>Deployment ID</p>
                <p>{deploymentData?.id}</p>
              </li>
              <li>
                <p className='text-muted-foreground'>Deployment message</p>
                <p>{deploymentData?.deployment_msg}</p>
              </li>
            </>
          )}
        </ul>
      </div>
    )
  )
}
