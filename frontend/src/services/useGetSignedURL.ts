import { ServerRoutes } from '@/constants'
import { ApiResponse, PresignedUrlResponse } from '@/types/response'
import apiClient from '@/utils/apiClient'
import { useMutation } from '@tanstack/react-query'

interface DistFiles {
  path: string
  type: string
}

interface GetPresignedURLRequest {
  bucketName: string
  workspaceId: string
  distFiles: DistFiles[]
}

const getPresignedURLs = async (data: GetPresignedURLRequest): Promise<ApiResponse<PresignedUrlResponse[]>> => {
  const response = await apiClient.post(ServerRoutes.provider.createSignedUrl, data)
  return response.data
}

export const useGetPresignedURLs = () => {
  return useMutation({
    mutationFn: getPresignedURLs,
    onError: (error: any) => {
      console.error(error.response?.data?.message || error.message)
    }
  })
}
