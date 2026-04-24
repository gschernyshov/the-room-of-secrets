import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { RoomChat } from '@/widgets/roomChat'
import { RoomSidebar } from '@/widgets/roomSidebar'
import { useShowAlert } from '@/widgets/globalAlert'
import { useJoinRoom } from '@/features/room/joinRoom'
import { useExitRoom } from '@/features/room/exitRoom'
import { useRoomStore } from '@/entities/room/model/roomStore'
import { useRoomEvents } from '@/entities/room/model/useRoomEvents'
import { type Room } from '@/entities/room/model/types'
import { useMessageEvents } from '@/entities/message/model/useMessageEvents'
import { useSocketStore } from '@/shared/store/socketStore'
import { usePageTitle } from '@/shared/lib/hooks/usePageTitle'
import { useAppNavigate } from '@/shared/lib/router/useAppNavigate'
import { Loader } from '@/shared/ui/Loader/Loader'
import styles from './RoomPage.module.scss'

export const RoomPage = () => {
  const { roomId } = useParams<Record<'roomId', Room['id']>>()

  usePageTitle(`Комната${roomId ? `: «${roomId}»` : ''}`)

  useRoomEvents()
  useMessageEvents()

  const { error } = useRoomStore()
  const { isConnecting, isConnected } = useSocketStore()
  const { goToProfile } = useAppNavigate()
  const { isLoading, join } = useJoinRoom()
  const { exit } = useExitRoom()
  const { errorAlert } = useShowAlert()

  useEffect(() => {
    if (!isConnected || !roomId) return

    join(roomId)

    return () => {
      if (isConnected) exit(roomId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, isConnected])

  useEffect(() => {
    if (error) {
      errorAlert(`Ошибка при подключении к комнате`, error)
      goToProfile()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])

  if (isConnecting || isLoading) {
    return <Loader size="m" />
  }

  return (
    <div className={styles['room-page']}>
      <div className={styles['room-page__chat-area']}>
        <RoomChat />
      </div>

      <div className={styles['room-page__sidebar']}>
        <RoomSidebar />
      </div>
    </div>
  )
}
