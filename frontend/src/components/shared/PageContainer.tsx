import { PropsWithChildren } from 'react'

export default function PageContainer({ children }: PropsWithChildren) {
  return <div className='mx-auto max-w-7xl px-10 py-10'>{children}</div>
}
