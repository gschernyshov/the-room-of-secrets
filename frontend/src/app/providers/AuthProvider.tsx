import { useEffect, type ReactNode } from 'react'
import { useShowAlert } from '@/widgets/globalAlert'
import { useInitAuth } from '@/entities/session/model/useInitAuth'
import { initTokenRefreshListener } from '@/entities/session/lib/initTokenRefreshListener'
import { Loader } from '@/shared/ui/Loader'

type Props = {
  children: ReactNode
}

export const AuthProvider = ({ children }: Props) => {
  const { status, error } = useInitAuth()
  const { errorAlert } = useShowAlert()

  useEffect(() => {
    if (error) {
      errorAlert('Ошибка', error)
    }
  }, [error, errorAlert])

  useEffect(() => {
    initTokenRefreshListener()
  }, [])

  if (status === 'loading') {
    return (
      <div style={{ height: '100vh', width: '100vw' }}>
        <Loader size="l" />
      </div>
    )
  }

  return <>{children}</>
}
