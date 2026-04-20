import { Button } from '@gravity-ui/uikit'
import { useLeaveRoom } from '../lib/useLeaveRoom'
import { useShowAlert } from '@/widgets/globalAlert'
import { type Room } from '@/entities/room/types'
import { getErrorMessage } from '@/shared/utils/getErrorMessage'

type Props = {
  roomId: Room['id']
}

export const LeaveRoom = ({ roomId }: Props) => {
  const { isLoading, leaveRoom } = useLeaveRoom()
  const { errorAlert } = useShowAlert()

  const handleLeaveRoom = async () => {
    try {
      await leaveRoom(roomId)
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
