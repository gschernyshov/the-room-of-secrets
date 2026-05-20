import { Button } from '@gravity-ui/uikit'
import { useLeaveRoom } from '../model/useLeaveRoom'
import { useShowAlert } from '@/widgets/globalAlert'
import { type Room } from '@/entities/room/model/types'
import { getErrorMessage } from '@/shared/utils/getErrorMessage'
import { useAppNavigate } from '@/shared/lib/router/useAppNavigate'

type Props = {
  roomId: Room['id']
}

export const LeaveRoom = ({ roomId }: Props) => {
  const { isLoading, leaveRoom } = useLeaveRoom()
  const { pathname, goToProfile } = useAppNavigate()
  const { errorAlert } = useShowAlert()

  const handleLeaveRoom = async () => {
    if (isLoading) return

    try {
      await leaveRoom(roomId)

      if (pathname.startsWith('/room/')) {
        goToProfile('rooms')
      }
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
      onClick={handleLeaveRoom}
    >
      {isLoading ? 'Выход из комнаты...' : 'Покинуть'}
    </Button>
  )
}
