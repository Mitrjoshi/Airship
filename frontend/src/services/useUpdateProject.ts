/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from '@/utils/apiClient'
import { ApiResponse, CloudFrontDistributionConfig } from '@/types/response'
import { useMutation } from '@tanstack/react-query'
import { ServerRoutes } from '@/constants'
import { toast } from 'sonner'
import { queryClient } from '@/main'
import { AxiosError } from 'axios'

const updateProject = async (data: {
  workspaceId: string
  distributionId: string
  region: string
  settings: CloudFrontDistributionConfig
}): Promise<ApiResponse> => {
  const response = await apiClient.post(`${ServerRoutes.projects.index}/update`, data)
  return response.data
}

export const useUpdateProject = () => {
  return useMutation({
    mutationFn: updateProject,
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
