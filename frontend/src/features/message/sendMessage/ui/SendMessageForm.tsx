import { useState, type SubmitEvent } from 'react'
import { TextInput, Button } from '@gravity-ui/uikit'
import { useSendMessage } from '../model/useSendMessage'
import { useShowAlert } from '@/widgets/globalAlert'
import { useRoomStore } from '@/entities/room/model/roomStore'
import { getErrorMessage } from '@/shared/utils/getErrorMessage'
import styles from './SendMessageForm.module.scss'

export const SendMessageForm = () => {
  const currentRoom = useRoomStore(state => state.currentRoom)
  const { errorAlert } = useShowAlert()
  const { isLoading, sendMessage } = useSendMessage(currentRoom?.id)
  const [newMessage, setNewMessage] = useState('')

  const handleSubmit = async (e: SubmitEvent<HTMLElement>) => {
    e.preventDefault()

    if (isLoading) return

    try {
      await sendMessage(newMessage)
      setNewMessage('')
    } catch (error) {
      errorAlert('Ошибка отправки сообщения', getErrorMessage(error))
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles['send-message-form']}>
      <TextInput
        size="xl"
        pin="round-round"
        disabled={isLoading}
        placeholder="Введите сообщение..."
        value={newMessage}
        onChange={e => setNewMessage(e.target.value)}
        className={styles['send-message-form__input']}
      />
      <Button
        view="action"
        type="submit"
        size="xl"
        pin="circle-circle"
        disabled={isLoading || !newMessage.trim()}
        loading={isLoading}
        className={styles['send-message-form__button']}
      >
        {isLoading ? 'Отправка...' : 'Отправить'}
      </Button>
    </form>
  )
}
