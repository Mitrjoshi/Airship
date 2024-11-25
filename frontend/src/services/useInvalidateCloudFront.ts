/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from '@/utils/apiClient'
import { ApiResponse } from '@/types/response'
import { useMutation } from '@tanstack/react-query'
import { ServerRoutes } from '@/constants'
import { toast } from 'sonner'

interface I_Request {
  workspaceId: string
  distributionId: string
  region: string
  path: string
}

const invalidate = async (data: I_Request): Promise<ApiResponse> => {
  const response = await apiClient.post(ServerRoutes.provider.invalidateCloudFront, data)
  return response.data
}

export const useInvalidateCloudFront = () => {
  return useMutation({
    mutationFn: invalidate,
    onError: (error: any) => {
      toast.error('Uh oh! Something went wrong.')
      console.error(error.response?.data?.message || error.message)
    }
  })
}
