import apiClient from '@/utils/apiClient'
import { ApiResponse } from '@/types/response'
import { useMutation } from '@tanstack/react-query'
import { ServerRoutes } from '@/constants'
import { AxiosError } from 'axios'
import { queryClient } from '@/routes/Root'
import { useNavigate, useParams } from 'react-router-dom'

interface I_Request {
  project_id: string
  deployment_msg: string
}

const createDeployment = async (data: I_Request): Promise<ApiResponse> => {
  const response = await apiClient.post(ServerRoutes.deployments.create, data)
  return response.data
}

export const useCreateDeployment = () => {
  const navigate = useNavigate()
  const { workspaceId, projectId } = useParams()

  return useMutation({
    mutationFn: createDeployment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['GET_DEPLOYMENTS']
      })

      navigate(`/workspace/${workspaceId}/${projectId}`)
    },
    onError: (error: AxiosError<ApiResponse>) => {
      console.error(error.response?.data?.message || error.message)
    }
  })
}
