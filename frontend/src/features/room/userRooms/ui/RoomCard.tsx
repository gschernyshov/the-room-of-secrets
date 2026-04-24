import { Button, ClipboardButton } from '@gravity-ui/uikit'
import { LeaveRoom } from '@/features/room/leaveRoom'
import { type Room } from '@/entities/room/model/types'
import { useAppNavigate } from '@/shared/lib/router/useAppNavigate'
import styles from './RoomCard.module.scss'

type Props = {
  room: Room
}

export const RoomCard = ({ room }: Props) => {
  const { goToRoom } = useAppNavigate()

  return (
    <div className={styles['room-card']}>
      <div className={styles['room-card__info']}>
        <h1 className={styles['room-card__title']}>Комната «{room.name}»</h1>
        <div className={styles['room-card__id']}>
          {room.id}
          <ClipboardButton text={room.id} />
        </div>
      </div>
      <div className={styles['room-card__actions']}>
        <Button
          view="outlined"
          size="l"
          pin="round-round"
          onClick={() => goToRoom(room.id)}
          className={styles['room-card__enter-btn']}
        >
          Войти
        </Button>
        <div className={styles['room-card__leave-btn']}>
          <LeaveRoom roomId={room.id} />
        </div>
      </div>
    </div>
  )
}
