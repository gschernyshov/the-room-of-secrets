import { useState } from 'react'
import { useRoomListStore } from '@/entities/room/model/roomListStore'
import { type Room } from '@/entities/room/types'
import { useAppNavigate } from '@/shared/lib/router/useAppNavigate'
import { apiFetch } from '@/shared/api/apiFetch'
import { AppError } from '@/shared/utils/errors'

export const useCreateRoom = () => {
  const { goToRoom } = useAppNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const createRoom = async (name: Room['name']) => {
    setIsLoading(true)
    try {
      const response = await apiFetch('/room/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })

      const result = await response.json()

      if (result.success) {
        useRoomListStore.getState().addRoom(result.data)
        goToRoom(result.data.id)
      } else {
        throw new AppError(
          'При создании комнаты возникла непредвиденная ошибка',
          result.error.message
        )
      }
    } catch (error) {
      if (error instanceof AppError) throw error

      throw new AppError('При создании комнаты возникла непредвиденная ошибка')
    } finally {
      setIsLoading(false)
    }
  }

  return { isLoading, createRoom }
}
