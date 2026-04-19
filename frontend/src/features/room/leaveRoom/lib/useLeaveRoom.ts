import { useState } from 'react'
import { useRoomListStore } from '@/entities/room/model/roomListStore'
import { type Room } from '@/entities/room/types'
import { apiFetch } from '@/shared/api/apiFetch'
import { AppError } from '@/shared/utils/errors'

export const useLeaveRoom = () => {
  const [isLoading, setIsLoading] = useState(false)

  const leaveRoom = async (id: Room['id']) => {
    setIsLoading(true)
    try {
      const response = await apiFetch('/room/leave', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      const result = await response.json()

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
