import { type sendMessageRequest, type sendMessageResponse } from './types'
import { MESSAGE_EVENTS } from '../model/messageEvents'
import { type Message } from '../model/types'
import { type Room } from '@/entities/room/model/types'
import { socketService } from '@/shared/api/socketService'
import { AppError } from '@/shared/utils/errors'

export const messageService = {
  sendMessage: (roomId: Room['id'], content: Message['content']) => {
    return new Promise<sendMessageResponse>((resolve, reject) => {
      socketService.emit<sendMessageRequest, sendMessageResponse>(
        MESSAGE_EVENTS.SEND_MESSAGE,
        {
          roomId,
          content,
        },
        response => {
          if (response.success) {
            resolve()
          } else {
            reject(
              new AppError(
                'При отправке сообщения возникла непредвиденная ошибка',
                response.error.message
              )
            )
          }
        }
      )
    })
  },
}
