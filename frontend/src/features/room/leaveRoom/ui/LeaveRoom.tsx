import { Button } from '@gravity-ui/uikit'
import { useLeaveRoom } from '../lib/useLeaveRoom'
import { useShowAlert } from '@/widgets/globalAlert'
import { type Room } from '@/entities/room/types'
import { AppError } from '@/shared/utils/errors'

type Props = {
  roomId: Room['id']
}

export const LeaveRoom = ({ roomId }: Props) => {
  const { isLoading, leaveRoom } = useLeaveRoom()
  const { errorAlert } = useShowAlert()

  const handleLeaveRoom = async () => {
    try {
      leaveRoom(roomId)
    } catch (error) {
      if (error instanceof AppError)
        errorAlert('Ошибка при выходе из комнаты', error.message)
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
