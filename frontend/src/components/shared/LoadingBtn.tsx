import { PropsWithChildren } from 'react'
import { Button, ButtonProps } from '../ui/button'
import { LoaderIcon } from 'lucide-react'

interface LoadingBtnProps extends ButtonProps {
  isLoading?: boolean
  className?: string
}

export default function LoadingBtn({ children, isLoading, className, ...rest }: PropsWithChildren<LoadingBtnProps>) {
  return (
    <Button {...rest} className={`relative ${className}`}>
      {isLoading ? (
        <LoaderIcon className='h-4 w-4 animate-spin' />
      ) : (
        <span className={isLoading ? 'flex opacity-0' : 'flex opacity-100'}>{children}</span>
      )}
    </Button>
  )
}
