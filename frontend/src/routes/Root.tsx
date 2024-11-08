import { ThemeProvider } from '@/components/themes/ThemeProvider'
import { Outlet } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/toaster'
import NavBar from '@/components/shared/NavBar'

const queryClient = new QueryClient()

export default function Root() {
  return (
    <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
      <QueryClientProvider client={queryClient}>
        <NavBar />
        <Outlet />
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  )
}
