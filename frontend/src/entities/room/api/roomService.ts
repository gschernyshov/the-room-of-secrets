import {
  type JoinRoomRequest,
  type JoinRoomResponse,
  type ExitRoomRequest,
  type ExitRoomResponse,
} from './types'
import { ROOM_EVENTS } from '../model/roomEvents'
import { socketService } from '@/shared/api/socketService'
import { AppError } from '@/shared/utils/errors'

export const roomService = {
  joinRoom: (roomId: string): Promise<JoinRoomResponse> => {
    return new Promise((resolve, reject) => {
      socketService.emit<JoinRoomRequest, JoinRoomResponse>(
        ROOM_EVENTS.JOIN_ROOM,
        { roomId },
        response => {
          if (response.success) {
            resolve(response.data)
          } else {
            reject(
              new AppError(
                'При попытке войти в комнату возникла непредвиденная ошибка',
                response.error.message
              )
            )
          }
        }
      )
    })
  },

  exitRoom: (roomId: string): Promise<ExitRoomResponse> => {
    return new Promise((resolve, reject) => {
      socketService.emit<ExitRoomRequest, ExitRoomResponse>(
        ROOM_EVENTS.EXIT_ROOM,
        { roomId },
        response => {
          if (response.success) {
            resolve()
          } else {
            reject(
              new AppError(
                'При выходе из комнаты возникла непредвиденная ошибка',
                response.error.message
              )
            )
          }
        }
      )
    })
  },
}
