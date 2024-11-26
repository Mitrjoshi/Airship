/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from '@/utils/apiClient'
import { ApiResponse } from '@/types/response'
import { useMutation } from '@tanstack/react-query'
import { ServerRoutes } from '@/constants'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import { queryClient } from '@/main'

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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['GET_SINGLE_PROJECT']
      })
    },
    onError: (error: AxiosError<ApiResponse>) => {
      toast.error(error?.response?.data?.message || 'Unexpected error occurred.')
    }
  })
}
