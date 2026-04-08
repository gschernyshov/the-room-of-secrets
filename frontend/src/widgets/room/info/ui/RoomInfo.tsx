import { ClipboardButton } from '@gravity-ui/uikit'
import { useRoomStore } from '@/entities/room/model/roomStore'
import styles from './RoomInfo.module.scss'

export const RoomInfo = () => {
  const currentRoom = useRoomStore(state => state.currentRoom)

  return (
    <div className={styles['room-info']}>
      <h1 className={styles['room-info__title']}>
        Комната «{currentRoom?.name}»
      </h1>
      <div className={styles['room-info__id']}>
        {currentRoom?.id}
        <ClipboardButton text={currentRoom?.id ?? 'ID комнаты отсутствует'} />
      </div>
    </div>
  )
}
