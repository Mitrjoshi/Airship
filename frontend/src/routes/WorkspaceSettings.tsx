import PageContainer from '@/components/shared/PageContainer'
import TitleHeader from '@/components/shared/TitleHeader'
import { useGetWorkspaceDetails } from '@/services/useGetWorkspaceDetails'
import { useParams } from 'react-router-dom'

export const WorkspaceSettings = () => {
  const { workspaceId } = useParams()

  const { data: workspaceData } = useGetWorkspaceDetails(workspaceId as string)

  return (
    <PageContainer>
      <TitleHeader title={workspaceData?.data?.name || 'Workspace Name'} showBackBtn />
    </PageContainer>
  )
}
