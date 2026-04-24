import { useState } from 'react'
import { messageService } from '@/entities/message/api/messageService'
import { type Message } from '@/entities/message/model/types'
import { type Room } from '@/entities/room/model/types'
import { AppError } from '@/shared/utils/errors'

export const useSendMessage = (roomId?: Room['id']) => {
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async (newMessage: Message['content']) => {
    if (isLoading || !roomId || !newMessage.trim()) return

    setIsLoading(true)
    try {
      await messageService.sendMessage(roomId, newMessage)
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
