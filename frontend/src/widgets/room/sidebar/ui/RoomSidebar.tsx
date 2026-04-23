import { useSessionStore } from '@/entities/session/model/sessionStore'
import { useRoomStore } from '@/entities/room/model/roomStore'
import { usePresenceStore } from '@/entities/room/model/presenceStore'
import styles from './RoomSidebar.module.scss'

export const RoomSidebar = () => {
  const { user } = useSessionStore()
  const { currentRoom } = useRoomStore()
  const { onlineUserIds } = usePresenceStore()

  return (
    <div className={styles['room-sidebar']}>
      <h3 className={styles['room-sidebar__title']}>
        Участники ({currentRoom?.participants.length})
      </h3>

      <ul>
        {currentRoom?.participants.map(participant => (
          <li key={participant.userId}>
            Пользователь {participant.userId}
            {participant.userId === user?.id && ' (Вы)'}
            {participant.userId !== user?.id && (
              <span>
                {' '}
                — {onlineUserIds.has(participant.userId) ? '🟢' : '⚪'}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
