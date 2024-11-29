import { PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'

export const ProtectedRoutes = ({ children }: PropsWithChildren) => {
  const token = localStorage.getItem('token')

  return token ? children : <Navigate to={'/'} />
}
