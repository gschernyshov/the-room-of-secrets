import { useState } from 'react'
import { exitRoom } from './exitRoom'
import { type Room } from '@/entities/room/model/types'
import { AppError } from '@/shared/utils/errors'

export const useExitRoom = () => {
  const [isLoading, setIsLoading] = useState(false)

  const exit = async (id: Room['id']) => {
    if (isLoading) return

    setIsLoading(true)
    try {
      await exitRoom(id)
    } catch (error) {
      if (error instanceof AppError) throw error

      throw new AppError('При выходе из комнаты возникла непредвиденная ошибка')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    exit,
  }
}
