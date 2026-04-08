import { useEffect, type ReactNode } from 'react'
import { useInitAuth } from '@/entities/session/model/useInitAuth'
import { initTokenRefreshListener } from '@/entities/session/lib/initTokenRefreshListener'
import { useShowAlert } from '@/widgets/globalAlert'

type Props = {
  children: ReactNode
}

export const AuthProvider = ({ children }: Props) => {
  const { status, error } = useInitAuth()
  const { errorAlert } = useShowAlert()

  useEffect(() => {
    if (error) {
      errorAlert('Ошибка аутентификации', error)
    }
  }, [error, errorAlert])

  useEffect(() => {
    initTokenRefreshListener()
  }, [])

  if (status === 'loading') {
    return <div>Загрузка...</div>
  }

  return <>{children}</>
}
