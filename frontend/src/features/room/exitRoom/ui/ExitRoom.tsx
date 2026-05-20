import { Button } from '@gravity-ui/uikit'
import { useExitRoom } from '../model/useExitRoom'
import { type Room } from '@/entities/room/model/types'
import { useShowAlert } from '@/widgets/globalAlert'
import { useAppNavigate } from '@/shared/lib/router/useAppNavigate'
import { getErrorMessage } from '@/shared/utils/getErrorMessage'

type Props = {
  roomId: Room['id']
}

export const ExitRoom = ({ roomId }: Props) => {
  const { isLoading, exit } = useExitRoom()
  const { goToProfile } = useAppNavigate()
  const { errorAlert } = useShowAlert()

  const handleExitRoom = async () => {
    if (isLoading) return

    try {
      await exit(roomId)

      goToProfile('rooms')
    } catch (error) {
      errorAlert('Ошибка при выходе из комнаты', getErrorMessage(error))
    }
  }

  return (
    <Button
      view="outlined"
      size="l"
      pin="round-round"
      disabled={isLoading}
      loading={isLoading}
      onClick={handleExitRoom}
    >
      {isLoading ? 'Выход из комнаты...' : 'Выйти'}
    </Button>
  )
}
