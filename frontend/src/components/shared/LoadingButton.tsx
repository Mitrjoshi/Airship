import * as React from 'react'
import { cn } from '@/lib/utils'
import { Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface LoadingButtonProps extends React.ComponentProps<typeof Button> {
  isLoading: boolean
  contentClassName?: string
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ isLoading, children, className, contentClassName, disabled, ...props }, ref) => {
    return (
      <Button className={cn('relative', className)} disabled={isLoading || disabled} ref={ref} {...props}>
        {isLoading && (
          <span className='absolute inset-0 flex items-center justify-center'>
            <Loader className='h-4 w-4 animate-spin' />
          </span>
        )}
        <span className={cn('flex items-center gap-2', isLoading ? 'invisible' : '', contentClassName)}>
          {children}
        </span>
      </Button>
    )
  }
)

LoadingButton.displayName = 'LoadingButton'

export default LoadingButton
