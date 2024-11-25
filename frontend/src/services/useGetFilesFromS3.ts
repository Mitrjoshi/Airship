import { useQuery } from '@tanstack/react-query'
import { ApiResponse, GetFilesResponse } from '@/types/response'
import apiClient from '@/utils/apiClient'
import { ServerRoutes } from '@/constants'

interface I_Param {
  workspaceId: string
  bucketName: string
  region: string
}

export const getFilesList = async (data: I_Param): Promise<ApiResponse<GetFilesResponse[]>> => {
  const response = await apiClient.post(ServerRoutes.provider.getS3Files, data)
  return response.data
}

export const useGetFilesFromS3 = (data: I_Param) => {
  return useQuery({
    queryKey: ['GET_FILES_FROM_S3', data.bucketName],
    queryFn: () => getFilesList(data),
    staleTime: 5 * 60 * 1000, // 5 mins,
    enabled: !!data.bucketName && !!data.region && !!data.workspaceId
  })
}
