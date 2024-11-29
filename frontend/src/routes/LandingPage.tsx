import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export const LandingPage = () => {
  const token = localStorage.getItem('token')

  return (
    <div className='p-6'>
      Landing page
      <div className='mt-2'>
        <Link to={token ? '/workspace' : '/auth'}>
          <Button>Login</Button>
        </Link>
      </div>
    </div>
  )
}
