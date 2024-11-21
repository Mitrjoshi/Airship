/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from '@/utils/apiClient'
import { ApiResponse, CloudFrontDistributionConfig } from '@/types/response'
import { useMutation } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import { ServerRoutes } from '@/constants'

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
  const { toast } = useToast()

  return useMutation({
    mutationFn: updateProject,
    onError: (error: any) => {
      toast({
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.'
      })
      console.error(error.response?.data?.message || error.message)
    }
  })
}
