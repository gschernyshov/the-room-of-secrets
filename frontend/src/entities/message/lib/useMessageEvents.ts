import { useEffect } from 'react'
import { MESSAGE_EVENTS } from '../model/messageEvent'
import { type NewMessageData } from '../types'
import { useMessagesStore } from '@/entities/message/model/messagesStore'
import { useSocketStore } from '@/shared/store/socketStore'
import { socketService } from '@/shared/api/socketService'

export const useMessageEvents = () => {
  const isConnected = useSocketStore(state => state.isConnected)
  const addMessage = useMessagesStore(state => state.addMessage)

  useEffect(() => {
    if (!isConnected) return

    socketService.on<NewMessageData>(MESSAGE_EVENTS.NEW_MESSAGE, data => {
      addMessage(data)
    })

    return () => {
      socketService.off(MESSAGE_EVENTS.NEW_MESSAGE)
    }
  }, [isConnected, addMessage])
}
