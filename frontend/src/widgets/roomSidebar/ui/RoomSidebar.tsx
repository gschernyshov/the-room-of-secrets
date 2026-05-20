import clsx from 'clsx'
import { ExitRoom } from '@/features/room/exitRoom'
import { LeaveRoom } from '@/features/room/leaveRoom'
import { useSessionStore } from '@/entities/session/model/sessionStore'
import { useRoomStore } from '@/entities/room/model/roomStore'
import { usePresenceStore } from '@/entities/room/model/presenceStore'
import styles from './RoomSidebar.module.scss'

export const RoomSidebar = () => {
  const user = useSessionStore(state => state.user)
  const currentRoom = useRoomStore(state => state.currentRoom)
  const onlineUserIds = usePresenceStore(state => state.onlineUserIds)

  if (!currentRoom) return null

  return (
    <div className={styles['room-sidebar']}>
      <h3 className={styles['room-sidebar__title']}>
        Участники ({currentRoom.participants.length})
      </h3>

      <ul className={styles['room-sidebar__list']}>
        {user && currentRoom.participants.some(p => p.userId === user.id) && (
          <li
            className={clsx(
              styles['room-sidebar__item'],
              styles['room-sidebar__item--current']
            )}
          >
            Пользователь {user.id} <span>(Вы)</span>
          </li>
        )}
        {currentRoom.participants.map(
          participant =>
            participant.userId !== user?.id && (
              <li
                key={participant.userId}
                className={clsx(styles['room-sidebar__item'])}
              >
                Пользователь {participant.userId}
                {participant.userId === user?.id ? (
                  ' (Вы)'
                ) : (
                  <span
                    className={clsx(
                      styles['room-sidebar__item-status'],
                      onlineUserIds.has(participant.userId) &&
                        styles['room-sidebar__item-status--active']
                    )}
                  >
                    {onlineUserIds.has(participant.userId)
                      ? ' (в сети)'
                      : ' (не в сети)'}
                  </span>
                )}
              </li>
            )
        )}
      </ul>
      <div className={styles['room-sidebar__actions']}>
        <ExitRoom roomId={currentRoom.id} />
        <LeaveRoom roomId={currentRoom.id} />
      </div>
    </div>
  )
}
