import { useSessionStore } from '@/entities/session/model/sessionStore'
import { useRoomStore } from '@/entities/room/model/roomStore'
import styles from './RoomSidebar.module.scss'

export const RoomSidebar = () => {
  const { user } = useSessionStore()
  const { currentRoom } = useRoomStore()

  return (
    <div className={styles['room-sidebar']}>
      <h3 className={styles['room-sidebar__title']}>
        Участники ({currentRoom?.participants.length})
      </h3>

      <ul className={styles['room-sidebar__list']}>
        {currentRoom?.participants.map(participant => (
          <li key={participant} className={styles['room-sidebar__item']}>
            Пользователь с id {participant} {participant === user?.id && '(Вы)'}
          </li>
        ))}
      </ul>
    </div>
  )
}
