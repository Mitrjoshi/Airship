import apiClient from '@/utils/apiClient'
import { ApiResponse } from '@/types/response'
import { CreateWorkspaceRequest } from '@/types/requests'
import { useMutation } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import { queryClient } from '@/main'

const createWorkspace = async (data: CreateWorkspaceRequest): Promise<ApiResponse> => {
  const response = await apiClient.post('/workspace/create', data)
  return response.data
}

export const useCreateWorkspace = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return useMutation({
    mutationFn: createWorkspace,
    onSuccess: (data) => {
      if (data.data) {
        navigate(pathname.replace('create', data.data.workspace_id), {
          replace: true
        })
      }

      queryClient.invalidateQueries({
        queryKey: ['GET_WORKSPACES']
      })
    },
    onError: (error: AxiosError<ApiResponse>) => {
      toast.error(error?.response?.data?.message || 'Unexpected error occurred.')
    }
  })
}
