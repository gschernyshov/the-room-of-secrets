import { useRef, useState, useEffect, useCallback } from 'react'
import { exitRoom } from './exitRoom'
import { type Room } from '@/entities/room/model/types'
import { AppError } from '@/shared/utils/errors'

export const useExitRoom = () => {
  const [isLoading, setIsLoading] = useState(false)
  const isLoadingRef = useRef(false)

  useEffect(() => {
    isLoadingRef.current = isLoading
  }, [isLoading])

  const exit = useCallback(async (id: Room['id']) => {
    if (isLoadingRef.current) return

    setIsLoading(true)
    try {
      await exitRoom(id)
    } catch (error) {
      if (error instanceof AppError) throw error

      throw new AppError('При выходе из комнаты возникла непредвиденная ошибка')
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    isLoading,
    exit,
  }
}
