import { RoomInfo } from './RoomInfo'
import { MessageList } from './MessageList'
import { SendMessageForm } from '@/features/message/sendMessage'
import styles from './RoomChat.module.scss'

export const RoomChat = () => {
  return (
    <div className={styles['room-chat']}>
      <div className={styles['room-chat__header']}>
        <RoomInfo />
      </div>

      <div className={styles['room-chat__messages']}>
        <MessageList />
      </div>

      <div className={styles['room-chat__send-message']}>
        <SendMessageForm />
      </div>
    </div>
  )
}
