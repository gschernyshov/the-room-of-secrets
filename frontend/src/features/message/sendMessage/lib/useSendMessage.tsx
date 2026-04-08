import { useState } from 'react'
import { messageService } from '@/entities/message/lib/messageService'
import { useRoomStore } from '@/entities/room/model/roomStore'
import { type Message } from '@/entities/message/types'
import { AppError } from '@/shared/utils/errors'

export const useSendMessage = () => {
  const { currentRoom } = useRoomStore()
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async (newMessage: Message['content']) => {
    if (!currentRoom || !newMessage.trim()) return

    setIsLoading(true)
    try {
      await messageService.sendMessage(currentRoom.id, newMessage)
    } catch (error) {
      if (error instanceof AppError) throw error

      throw new AppError(
        'При отправке сообщения возникла непредвиденная ошибка'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    sendMessage,
  }
}
