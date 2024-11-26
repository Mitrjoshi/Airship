import apiClient from '@/utils/apiClient'
import { ApiResponse } from '@/types/response'
import { useMutation } from '@tanstack/react-query'
import { ServerRoutes } from '@/constants'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'

const signUp = async (data: { username: string; password: string; email: string }): Promise<ApiResponse<string>> => {
  const response = await apiClient.post(`${ServerRoutes.auth.signup}`, data)
  return response.data
}

export const useSignUp = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: signUp,
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
