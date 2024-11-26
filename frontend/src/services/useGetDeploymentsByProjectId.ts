import { useQuery } from '@tanstack/react-query'
import { ApiResponse, DeploymentsResponse } from '@/types/response'
import apiClient from '@/utils/apiClient'
import { ServerRoutes } from '@/constants'

export const getDeploymentsById = async (projectId: string): Promise<ApiResponse<DeploymentsResponse[]>> => {
  const response = await apiClient.get(`${ServerRoutes.deployments.index}/${projectId}`)
  return response.data
}

export const useGetDeploymentsByProjectId = (projectId: string) => {
  return useQuery({
    queryKey: ['GET_DEPLOYMENTS', projectId],
    queryFn: () => getDeploymentsById(projectId),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000 // 5 mins
  })
}
