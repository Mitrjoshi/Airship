/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from '@/utils/apiClient'
import { ApiResponse } from '@/types/response'
import { useMutation } from '@tanstack/react-query'
import { ServerRoutes } from '@/constants'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'

const login = async (data: { username: string; password: string }): Promise<ApiResponse<string>> => {
  const response = await apiClient.post(`${ServerRoutes.auth.login}`, data)
  return response.data
}

export const useLogin = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (data.data) {
        localStorage.setItem('token', data.data)
        navigate('/workspace', {
          replace: true
        })
      }
    },
    onError: (error: AxiosError<ApiResponse>) => {
      toast.error(error?.response?.data?.message || 'Unexpected error occurred.')
    }
  })
}
