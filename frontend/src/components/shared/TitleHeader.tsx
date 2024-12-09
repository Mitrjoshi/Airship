import { ReactNode } from 'react'

interface TitleHeaderProps {
  title: string
  element?: ReactNode
}

export default function TitleHeader({ title, element }: TitleHeaderProps) {
  return (
    <header className='mb-10 flex items-center justify-between'>
      <h2 className='text-xl font-semibold'>{title}</h2>
      {element && element}
    </header>
  )
}
