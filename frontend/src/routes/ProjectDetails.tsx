import { useGetSingleProject } from '@/services/useGetSingleProject'
import { checkStatusResponse, getProjectsResponse } from '@/types/response'
import { formatDate } from '@/utils/utils'
import { useParams } from 'react-router-dom'

export default function ProjectDetails() {
  const { projectId } = useParams()
  const { data: projectData } = useGetSingleProject(projectId as string)

  return (
    <div>
      <OverviewCard status={projectData?.data?.status as checkStatusResponse} projectData={projectData?.data} />
    </div>
  )
}

interface OverviewCardProps {
  projectData: getProjectsResponse | undefined
  status: checkStatusResponse
}

function OverviewCard({ projectData, status }: OverviewCardProps) {
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
            <div>
              <p className='text-muted-foreground'>Created</p>
              <p>
                {formatDate(projectData?.created_at as Date)} by{' '}
                <span className='cursor-pointer font-semibold duration-150'>@{projectData?.users.username}</span>
              </p>
            </div>
          </li>
          <li>
            <p className='text-muted-foreground'>Deployment message</p>
            <p>Initial deployment</p>
          </li>
        </ul>
      </div>
    )
  )
}
