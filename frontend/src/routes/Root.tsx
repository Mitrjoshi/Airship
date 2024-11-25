import { ThemeProvider } from '@/components/themes/ThemeProvider'
import { Outlet } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import NavBar from '@/components/shared/NavBar'
import { Toaster } from 'sonner'

export const queryClient = new QueryClient()

export default function Root() {
  return (
    <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
      <QueryClientProvider client={queryClient}>
        <NavBar />
        <Outlet />
      </QueryClientProvider>
      <Toaster position='top-right' richColors theme='light' toastOptions={{ duration: 2500 }} />
    </ThemeProvider>
  )
}
