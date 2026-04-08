import { ROOM_EVENTS } from '../model/roomEvents'
import {
  type CreateRoomRequest,
  type CreateRoomResponse,
  type JoinRoomRequest,
  type JoinRoomResponse,
  type LeaveRoomRequest,
  type LeaveRoomResponse,
} from '../types'
import { socketService } from '@/shared/api/socketService'
import { AppError } from '@/shared/utils/errors'

export const roomService = {
  createRoom: (name: string): Promise<CreateRoomResponse> => {
    return new Promise((resolve, reject) => {
      socketService.emit<CreateRoomRequest, CreateRoomResponse>(
        ROOM_EVENTS.CREATE_ROOM,
        { name },
        response => {
          if (response.success) {
            resolve(response.data)
          } else {
            reject(
              new AppError(
                response.error?.message ||
                  'При создании комнаты возникла непредвиденная ошибка'
              )
            )
          }
        }
      )
    })
  },

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
                  'При попытке присоединения к комнате возникла непредвиденная ошибка'
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
