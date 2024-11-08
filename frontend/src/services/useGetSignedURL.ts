import { ServerRoutes } from '@/constants'
import { useToast } from '@/hooks/use-toast'
import { ApiResponse } from '@/types/response'
import apiClient from '@/utils/apiClient'
import { useMutation } from '@tanstack/react-query'

interface getSignedURLRequest {
  bucketName: string
  workspaceId: string
}

const getSignedURL = async (data: getSignedURLRequest): Promise<ApiResponse> => {
  const response = await apiClient.post(ServerRoutes.provider.createSignedUrl, data)
  return response.data
}

export const useGetSignedURL = () => {
  const { toast } = useToast()

  return useMutation({
    mutationFn: getSignedURL,
    onError: (error: any) => {
      toast({
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.'
      })
      console.error(error.response?.data?.message || error.message)
    }
  })
}
