import { PropsWithChildren } from 'react'

export const FormPageContainer = ({ children }: PropsWithChildren) => {
  return <div className='mx-auto max-w-2xl px-10 py-10'>{children}</div>
}
