import { ROOM_EVENTS } from '../model/roomEvents'
import {
  type JoinRoomRequest,
  type JoinRoomResponse,
  type LeaveRoomRequest,
  type LeaveRoomResponse,
} from '../types'
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
                response.error?.message ||
                  'При попытке войти в комнату возникла непредвиденная ошибка'
              )
            )
          }
        }
      )
    })
  },

  leaveRoom: (roomId: string): Promise<LeaveRoomResponse> => {
    return new Promise((resolve, reject) => {
      socketService.emit<LeaveRoomRequest, LeaveRoomResponse>(
        ROOM_EVENTS.LEAVE_ROOM,
        { roomId },
        response => {
          if (response.success) {
            resolve()
          } else {
            reject(
              new AppError(
                response.error?.message ||
                  'При выходе из комнаты возникла непредвиденная ошибка'
              )
            )
          }
        }
      )
    })
  },
}
