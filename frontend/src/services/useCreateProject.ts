/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from '@/utils/apiClient'
import { ApiResponse } from '@/types/response'
import { CreateProjectRequest } from '@/types/requests'
import { useMutation } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { ServerRoutes } from '@/constants'
import { toast } from 'sonner'

const createProject = async (data: CreateProjectRequest): Promise<ApiResponse> => {
  const response = await apiClient.post(`${ServerRoutes.projects.index}/create`, data)
  return response.data
}

export const useCreateProject = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return useMutation({
    mutationFn: createProject,
    onSuccess: (data) => {
      if (data.data) {
        navigate(pathname.replace('create-static-website', data.data.projectId), {
          replace: true
        })
      }
    },
    onError: (error: any) => {
      toast.error('Uh oh! Something went wrong.')
      console.error(error.response?.data?.message || error.message)
    }
  })
}
