import { useQuery } from '@tanstack/react-query'
import { ApiResponse, WorkspaceDetailsResponse } from '@/types/response'
import apiClient from '@/utils/apiClient'
import { ServerRoutes } from '@/constants'

export const getWorkspaceById = async (workspaceId: string): Promise<ApiResponse<WorkspaceDetailsResponse>> => {
  const response = await apiClient.get(`${ServerRoutes.workspace.index}/details/${workspaceId}`)
  return response.data
}

export const useGetWorkspaceDetails = (workspaceId: string) => {
  return useQuery({
    queryKey: ['GET_WORKSPACE', workspaceId],
    queryFn: () => getWorkspaceById(workspaceId),
    enabled: !!workspaceId,
    staleTime: 5 * 60 * 1000 // 5 mins
  })
}
