import { useRef, useState, useEffect, useCallback } from 'react'
import { joinRoom } from './joinRoom'
import { useRoomStore } from '@/entities/room/model/roomStore'
import { type Room } from '@/entities/room/model/types'
import { getErrorMessage } from '@/shared/utils/getErrorMessage'

export const useJoinRoom = () => {
  const [isLoading, setIsLoading] = useState(false)
  const isLoadingRef = useRef(false)

  useEffect(() => {
    isLoadingRef.current = isLoading
  }, [isLoading])

  const join = useCallback(async (roomId: Room['id']) => {
    if (isLoadingRef.current) return

    setIsLoading(true)
    try {
      await joinRoom(roomId)
    } catch (error) {
      useRoomStore.getState().setError(getErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    isLoading,
    join,
  }
}
