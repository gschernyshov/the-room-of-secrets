import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { RoomInfo, RoomSidebar } from '@/widgets/room'
import { MessageList } from '@/widgets/message'
import { useShowAlert } from '@/widgets/globalAlert'
import { SendMessageForm } from '@/features/message/sendMessage'
import { useRoomStore } from '@/entities/room/model/roomStore'
import { roomService } from '@/entities/room/lib/roomService'
import { useRoomEvents } from '@/entities/room/lib/useRoomEvents'
import { useMessagesStore } from '@/entities/message/model/messagesStore'
import { useMessageEvents } from '@/entities/message/lib/useMessageEvents'
import { useSocketStore } from '@/shared/store/socketStore'
import { AppError } from '@/shared/utils/errors'
import styles from './RoomPage.module.scss'

export const RoomPage = () => {
  const { roomId } = useParams()
  const { isConnected } = useSocketStore()
  const { currentRoom, setCurrentRoom } = useRoomStore()
  const { setMessages } = useMessagesStore()
  const { errorAlert } = useShowAlert()

  useRoomEvents()
  useMessageEvents()

  useEffect(() => {
    if (!isConnected || !roomId) return

    const joinRoom = async () => {
      try {
        const { room, messages } = await roomService.joinRoom(roomId)

        setCurrentRoom(room)
        setMessages(messages)
      } catch (error) {
        if (error instanceof AppError)
          errorAlert(
            `Ошибка при подключении к комнате: ${roomId}`,
            error.message
          )
      }
    }

    joinRoom()

    return () => {
      if (roomId) {
        roomService.leaveRoom(roomId)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, roomId])

  if (!currentRoom) {
    return <div>Загрузка комнаты...</div>
  }

  return (
    <div className={styles['room-container']}>
      <div className={styles['room-container__chat-area']}>
        <div className={styles['room-container__chat-area__header']}>
          <RoomInfo />
        </div>

        <div className={styles['room-container__chat-area__messages']}>
          <MessageList />
        </div>

        <div className={styles['room-container__chat-area__input']}>
          <SendMessageForm />
        </div>
      </div>

      <div className={styles['room-container__sidebar']}>
        <RoomSidebar />
      </div>
    </div>
  )
}
