import { UserRoom } from './UserRoom'
import { useRoomListStore } from '@/entities/room/model/roomListStore'
import { Loader } from '@/shared/ui/Loader'
import styles from './UserRooms.module.scss'

export const UserRooms = () => {
  const { isLoading, rooms, error } = useRoomListStore()

  if (isLoading) return <Loader />

  if (error) return <p className={styles['user-rooms__text-info']}>{error}</p>

  if (!rooms.length)
    return <p className={styles['user-rooms__text-info']}>Комнаты не найдены</p>

  return (
    <div className={styles['user-rooms']}>
      {rooms.map(room => (
        <UserRoom key={room.id} room={room} />
      ))}
    </div>
  )
}
