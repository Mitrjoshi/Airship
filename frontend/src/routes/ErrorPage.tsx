import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export const ErrorPage = () => {
  return (
    <div className='flex h-dvh flex-col items-center justify-center gap-4'>
      <h1 className='text-[24rem] font-semibold text-muted-foreground blur-md'>404</h1>
      <div className='absolute flex flex-col gap-4 text-center'>
        <p className='text-2xl font-bold'>Looking for something? 🔍</p>
        <p className='text-md font-medium'>We could'nt find the page you were looking for!</p>
        <Link to='/'>
          <Button size='sm'>Head back</Button>
        </Link>
      </div>
    </div>
  )
}
