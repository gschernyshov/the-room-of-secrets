import { type ReactNode } from 'react'
import { useInitAuth } from '../init/auth/useInitAuth'

type Props = {
  children: ReactNode
}

export const AuthProvider = ({ children }: Props) => {
  const status = useInitAuth()

  if (status === 'loading') {
    return <div>Загрузка...</div>
  }

  return <>{children}</>
}
