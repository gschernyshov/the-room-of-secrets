import { useState } from 'react'
import { messageService } from '@/entities/message/lib/messageService'
import { type Message } from '@/entities/message/types'
import { AppError } from '@/shared/utils/errors'
import type { Room } from '@/entities/room/types'

export const useSendMessage = (roomId: Room['id'] | undefined) => {
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
