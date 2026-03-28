import { useEffect } from 'react'
import { useSessionStore } from '@/entities/session/model/sessionStore'
import { useShowAlert } from '@/widgets/globalAlert'
import { getErrorMessage } from '@/shared/utils/getErrorMessage'

export const useInitAuth = () => {
  const status = useSessionStore(state => state.status)
  const { errorAlert } = useShowAlert()

  useEffect(() => {
    const init = async () => {
      try {
        await useSessionStore.getState().init()
      } catch (error) {
        errorAlert('Ошибка аутентификации', getErrorMessage(error))
      }
    }

    if (status === 'loading') {
      init()
    }
  }, [status, errorAlert])

  return status
}
