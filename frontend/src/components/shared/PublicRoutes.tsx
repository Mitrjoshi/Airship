import { ErrorPage } from '@/routes/ErrorPage'
import { PropsWithChildren } from 'react'

export const PublicRoutes = ({ children }: PropsWithChildren) => {
  const token = localStorage.getItem('token')

  return !token ? children : <ErrorPage />
}
