import { ThemeProvider } from '@/components/themes/ThemeProvider'
import { Outlet } from 'react-router-dom'
import NavBar from '@/components/shared/NavBar'

export default function Root() {
  return (
    <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
      <NavBar />
      <Outlet />
    </ThemeProvider>
  )
}
