import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { RoomInfo, RoomSidebar } from '@/widgets/room'
import { MessageList } from '@/widgets/message'
import { useShowAlert } from '@/widgets/globalAlert'
import { useRoomListStore } from '@/entities/room/model/roomListStore'
import { useRoomStore } from '@/entities/room/model/roomStore'
import { usePresenceStore } from '@/entities/room/model/presenceStore'
import { roomService } from '@/entities/room/lib/roomService'
import { useRoomEvents } from '@/entities/room/lib/useRoomEvents'
import { useMessagesStore } from '@/entities/message/model/messagesStore'
import { useMessageEvents } from '@/entities/message/lib/useMessageEvents'
import { SendMessageForm } from '@/features/message/sendMessage'
import { useSocketStore } from '@/shared/store/socketStore'
import { usePageTitle } from '@/shared/lib/hooks/usePageTitle'
import { getErrorMessage } from '@/shared/utils/getErrorMessage'
import { useAppNavigate } from '@/shared/lib/router/useAppNavigate'
import { AppNavigate } from '@/shared/lib/router/AppNavigate'
import { AppRoutes } from '@/shared/consts/router'
import { Loader } from '@/shared/ui/Loader'
import styles from './RoomPage.module.scss'

export const RoomPage = () => {
  const { roomId } = useParams()
  const currentRoom = useRoomStore(state => state.currentRoom)
  const { isConnecting, isConnected } = useSocketStore()
  const { goToProfile } = useAppNavigate()
  const { errorAlert } = useShowAlert()

  useRoomEvents()
  useMessageEvents()

  usePageTitle(`Комната: «${roomId}»`)

  useEffect(() => {
    if (!roomId || !isConnected) return

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

        useRoomStore.getState().clear()
        usePresenceStore.getState().clear()
        useMessagesStore.getState().clear()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, isConnected])

  if (!roomId) return <AppNavigate replace={true} to={AppRoutes.PROFILE} />

  if (isConnecting || !currentRoom) {
    return <Loader size="m" />
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
