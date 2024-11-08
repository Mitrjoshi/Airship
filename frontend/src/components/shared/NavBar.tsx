import { BellIcon, RocketIcon } from 'lucide-react'

export default function NavBar() {
  return (
    <nav className='flex h-14 items-center justify-between border-b p-4'>
      <div className='flex items-center space-x-1'>
        <RocketIcon />
        <h1 className='text-2xl font-semibold'>Airship</h1>
      </div>
      <div className='flex items-center gap-3'>
        <div className='flex size-8 items-center justify-center rounded-full border'>
          <BellIcon size={20} strokeWidth={1.5} />
        </div>
        <div className='size-8 rounded-full bg-gradient-to-br from-emerald-400 to-amber-300' />
      </div>
    </nav>
  )
}
