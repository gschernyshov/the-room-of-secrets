import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { RoomInfo, RoomSidebar } from '@/widgets/room'
import { MessageList } from '@/widgets/message'
import { useShowAlert } from '@/widgets/globalAlert'
import { SendMessageForm } from '@/features/message/sendMessage'
import { useSessionStore } from '@/entities/session/model/sessionStore'
import { useRoomListStore } from '@/entities/room/model/roomListStore'
import { useRoomStore } from '@/entities/room/model/roomStore'
import { usePresenceStore } from '@/entities/room/model/presenceStore'
import { roomService } from '@/entities/room/lib/roomService'
import { useRoomEvents } from '@/entities/room/lib/useRoomEvents'
import { useMessagesStore } from '@/entities/message/model/messagesStore'
import { useMessageEvents } from '@/entities/message/lib/useMessageEvents'
import { useSocketStore } from '@/shared/store/socketStore'
import { getErrorMessage } from '@/shared/utils/getErrorMessage'
import styles from './RoomPage.module.scss'
import { useAppNavigate } from '@/shared/lib/router/useAppNavigate'

export const RoomPage = () => {
  const { roomId } = useParams()
  const { isConnecting, isConnected } = useSocketStore()
  const user = useSessionStore(state => state.user)
  const currentRoom = useRoomStore(state => state.currentRoom)
  const { errorAlert } = useShowAlert()
  const { goToProfile } = useAppNavigate()

  console.log('isConnecting', isConnecting)
  console.log('isConnected', isConnected)

  useRoomEvents()
  useMessageEvents()

  useEffect(() => {
    if (!roomId || !isConnected || !user) return

    const joinRoom = async () => {
      try {
        const { room, messages, onlineUserIds } =
          await roomService.joinRoom(roomId)

        useRoomListStore.getState().addRoom(room)
        useRoomStore.getState().setCurrentRoom(room)
        usePresenceStore.getState().setOnline(onlineUserIds)
        useMessagesStore.getState().setMessages(messages)
      } catch (error) {
        goToProfile()
        errorAlert(`Ошибка при подключении к комнате`, getErrorMessage(error))
      }
    }

    joinRoom()

    return () => {
      if (roomId) {
        roomService.leaveRoom(roomId)
      }
    }
  }, [roomId, isConnected, user])

  if (isConnecting || !currentRoom) {
    return <div>Загрузка комнаты...</div>
  }

  return (
    <div className={styles['room-page']}>
      <div className={styles['room-page__chat-area']}>
        <div className={styles['room-page__chat-header']}>
          <RoomInfo />
        </div>

        <div className={styles['room-page__chat-messages']}>
          <MessageList />
        </div>

        <div className={styles['room-page__chat-input']}>
          <SendMessageForm />
        </div>
      </div>

      <div className={styles['room-page__sidebar']}>
        <RoomSidebar />
      </div>
    </div>
  )
}
