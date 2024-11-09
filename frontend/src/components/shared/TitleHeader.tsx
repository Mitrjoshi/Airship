import { ReactNode } from 'react'
import BackButton from './BackButton'

interface TitleHeaderProps {
  title: string
  element?: ReactNode
  showBackBtn?: boolean
}

export default function TitleHeader({ title, element, showBackBtn = false }: TitleHeaderProps) {
  return (
    <header className='mb-10 flex items-center justify-between'>
      <div>
        <BackButton showBackBtn={showBackBtn} />
        <h2 className='text-xl font-semibold'>{title}</h2>
      </div>

      {element && element}
    </header>
  )
}
