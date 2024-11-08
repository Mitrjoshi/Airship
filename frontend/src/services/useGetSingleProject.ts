import { useQuery } from '@tanstack/react-query'
import { ApiResponse, getProjectsResponse } from '@/types/response'
import apiClient from '@/utils/apiClient'
import { ServerRoutes } from '@/constants'

export const getProjects = async (projectId: string): Promise<ApiResponse<getProjectsResponse>> => {
  const response = await apiClient.get(`/${ServerRoutes.projects.index}/${projectId}`)
  return response.data
}

export const useGetSingleProject = (projectId: string) => {
  return useQuery({
    queryKey: ['GET_SINGLE_PROJECT', projectId],
    queryFn: () => getProjects(projectId),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000 // 5 mins
  })
}
