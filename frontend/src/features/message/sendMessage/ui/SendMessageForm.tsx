import { useState, type SubmitEvent } from 'react'
import { TextInput, Button } from '@gravity-ui/uikit'
import { useSendMessage } from '../lib/useSendMessage'
import { useShowAlert } from '@/widgets/globalAlert'
import { AppError } from '@/shared/utils/errors'
import styles from './SendMessageForm.module.scss'

export const SendMessageForm = () => {
  const { errorAlert } = useShowAlert()
  const { isLoading, sendMessage } = useSendMessage()
  const [newMessage, setNewMessage] = useState('')

  const handleSubmit = async (e: SubmitEvent<HTMLElement>) => {
    e.preventDefault()

    try {
      await sendMessage(newMessage)

      setNewMessage('')
    } catch (error) {
      if (error instanceof AppError)
        errorAlert('Ошибка отправки сообщения', error.message)
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
