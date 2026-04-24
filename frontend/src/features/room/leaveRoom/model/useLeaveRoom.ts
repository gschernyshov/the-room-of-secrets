import { useState } from 'react'
import { leaveRoomApi } from '../api/leaveRoom'
import { useRoomListStore } from '@/entities/room/model/roomListStore'
import { type Room } from '@/entities/room/model/types'
import { AppError } from '@/shared/utils/errors'

export const useLeaveRoom = () => {
  const [isLoading, setIsLoading] = useState(false)

  const leaveRoom = async (id: Room['id']) => {
    if (isLoading) return

    setIsLoading(true)
    try {
      const result = await leaveRoomApi({ id })

      if (result.success) {
        useRoomListStore.getState().removeRoom(id)
      } else {
        throw new AppError(
          'При выходе из комнаты возникла непредвиденная ошибка',
          result.error.message
        )
      }
    } catch (error) {
      if (error instanceof AppError) throw error

      throw new AppError('При выходе из комнаты возникла непредвиденная ошибка')
    } finally {
      setIsLoading(false)
    }
  }

  return { isLoading, leaveRoom }
}
