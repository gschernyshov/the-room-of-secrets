import { useState, type SubmitEvent } from 'react'
import { TextInput, Button } from '@gravity-ui/uikit'
import { useCreateRoom } from '../lib/useCreateRoom'
import { useShowAlert } from '@/widgets/globalAlert'
import { AppError } from '@/shared/utils/errors'
import styles from './CreateRoomForm.module.scss'

type Props = {
  onPopupOpen: (popupOpen: boolean) => void
}

export const CreateRoomForm = ({ onPopupOpen }: Props) => {
  const { errorAlert } = useShowAlert()
  const { isLoading, createRoom } = useCreateRoom()
  const [nameRoom, setNameRoom] = useState('')

  const handleSubmit = async (e: SubmitEvent<HTMLElement>) => {
    e.preventDefault()

    try {
      await createRoom(nameRoom)

      onPopupOpen(false)
    } catch (error) {
      if (error instanceof AppError)
        errorAlert('Ошибка отправки сообщения', error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles['create-room-form']}>
      <h3 className={styles['create-room-form__title']}>
        Создать новую комнату
      </h3>

      <div className={styles['create-room-form__field']}>
        <TextInput
          size="xl"
          pin="round-round"
          disabled={isLoading}
          placeholder="Название комнаты"
          value={nameRoom}
          onChange={e => setNameRoom(e.target.value)}
          className={styles['create-room-form__input']}
        />
        <Button
          view="action"
          type="submit"
          size="xl"
          pin="circle-circle"
          disabled={isLoading || !nameRoom.trim()}
          loading={isLoading}
          className={styles['create-room-form__button']}
        >
          {isLoading ? 'Создание...' : 'Создать'}
        </Button>
      </div>
    </form>
  )
}
