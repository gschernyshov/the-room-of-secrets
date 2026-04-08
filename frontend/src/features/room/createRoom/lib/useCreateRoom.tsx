import { useState } from 'react'
import { roomService } from '@/entities/room/lib/roomService'
import { type Room } from '@/entities/room/types'
import { AppError } from '@/shared/utils/errors'
import { useAppNavigate } from '@/shared/lib/router/useAppNavigate'

export const useCreateRoom = () => {
  const { navigate } = useAppNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const createRoom = async (name: Room['name']) => {
    if (!name.trim()) return

    setIsLoading(true)
    try {
      const room = await roomService.createRoom(name)

      navigate(`/room/${room.id}`)
    } catch (error) {
      if (error instanceof AppError) throw error

      throw new AppError('При создании команты возникла непредвиденная ошибка')
    } finally {
      setIsLoading(false)
    }
  }

  return { isLoading, createRoom }
}
