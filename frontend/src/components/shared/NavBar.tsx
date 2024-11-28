import { BellIcon, LogOut, Moon, SettingsIcon, Sun } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu'
import { useTheme } from '../themes/ThemeProvider'
import { useState } from 'react'

export default function NavBar() {
  const { setTheme, theme } = useTheme()
  const [isRotating, setIsRotating] = useState(false)

  const handleThemeSwitch = () => {
    setIsRotating(true)
    setTimeout(() => {
      setTheme(theme === 'dark' ? 'light' : 'dark')
      setIsRotating(false)
    }, 300) // Match this duration to the CSS animation time
  }

  return (
    <nav className='flex h-14 items-center justify-between border-b p-4'>
      <Link to='/workspace' className='flex items-center space-x-1'>
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='size-6'>
          <path
            fillRule='evenodd'
            d='M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 0 1 .75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 0 1 9.75 22.5a.75.75 0 0 1-.75-.75v-4.131A15.838 15.838 0 0 1 6.382 15H2.25a.75.75 0 0 1-.75-.75 6.75 6.75 0 0 1 7.815-6.666ZM15 6.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z'
            clipRule='evenodd'
          />
          <path d='M5.26 17.242a.75.75 0 1 0-.897-1.203 5.243 5.243 0 0 0-2.05 5.022.75.75 0 0 0 .625.627 5.243 5.243 0 0 0 5.022-2.051.75.75 0 1 0-1.202-.897 3.744 3.744 0 0 1-3.008 1.51c0-1.23.592-2.323 1.51-3.008Z' />
        </svg>

        <h1 className='text-2xl font-semibold'>Airship</h1>
      </Link>
      <div className='flex items-center gap-3'>
        <div className='flex size-8 items-center justify-center rounded-full border'>
          <BellIcon size={20} strokeWidth={1.5} />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className='size-8 rounded-full bg-gradient-to-br from-emerald-400 to-blue-300' />
          </DropdownMenuTrigger>
          <DropdownMenuContent className='mr-5 w-[200px]'>
            <DropdownMenuItem>
              <SettingsIcon />
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault()
                handleThemeSwitch()
              }}
            >
              <div className={`icon-wrapper ${isRotating ? 'rotating' : ''}`}>
                {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
              </div>
              Theme
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
