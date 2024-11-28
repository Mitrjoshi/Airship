import apiClient from '@/utils/apiClient'
import { ApiResponse } from '@/types/response'
import { useMutation } from '@tanstack/react-query'
import { ServerRoutes } from '@/constants'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import { queryClient } from '@/main'
import { useLocation, useNavigate } from 'react-router-dom'

interface I_Request {
  workspaceId: string
  distributionId: string
  region: string
  projectId: string
  bucketName: string
}

const deleteProject = async (data: I_Request): Promise<ApiResponse> => {
  const response = await apiClient.post(ServerRoutes.projects.delete, data)
  return response.data
}

export const useDeleteProject = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['GET_PROJECTS']
      })

      navigate(pathname.split('/').slice(0, -2).join('/'))
    },
    onError: (error: AxiosError<ApiResponse>) => {
      toast.error(error?.response?.data?.message || 'Unexpected error occurred.')
    }
  })
}
