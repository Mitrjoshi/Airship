import { useNavigate } from 'react-router-dom'

interface BackButtonProps {
  showBackBtn: boolean
}

export default function BackButton({ showBackBtn }: BackButtonProps) {
  const navigate = useNavigate()

  const handleBack = () => navigate(-1)

  return (
    <>
      {showBackBtn && window.history.length > 1 && (
        <button className='flex items-center gap-2 text-sm' type='button' onClick={handleBack}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='size-5'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18' />
          </svg>
          Back
        </button>
      )}
    </>
  )
}
