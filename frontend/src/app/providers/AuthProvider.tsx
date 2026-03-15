import { type ReactNode } from 'react'
import { useInitAuth } from '../init/auth/useInitAuth'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const status = useInitAuth()

  if (status === 'loading') {
    return <div>Загрузка...</div>
  }

  return <>{children}</>
}
