import { useState } from 'react'
import { createRoomApi } from './createRoomApi'
import { useRoomListStore } from '@/entities/room/model/roomListStore'
import { type Room } from '@/entities/room/types'
import { useAppNavigate } from '@/shared/lib/router/useAppNavigate'
import { AppError } from '@/shared/utils/errors'

export const useCreateRoom = () => {
  const { goToRoom } = useAppNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const createRoom = async (name: Room['name']) => {
    if (isLoading) return

    setIsLoading(true)
    try {
      const result = await createRoomApi({ name })

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
