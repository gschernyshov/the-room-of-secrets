import { useRoomListStore } from '@/entities/room/model/roomListStore'
import { useRoomStore } from '@/entities/room/model/roomStore'
import { usePresenceStore } from '@/entities/room/model/presenceStore'
import { type Room } from '@/entities/room/model/types'
import { roomService } from '@/entities/room/api/roomService'
import { useMessagesStore } from '@/entities/message/model/messagesStore'

export const joinRoom = async (roomId: Room['id']) => {
  const { room, messages, onlineUserIds } = await roomService.joinRoom(roomId)

  useRoomListStore.getState().addRoom(room)
  useRoomStore.getState().setCurrentRoom(room)
  usePresenceStore.getState().setOnline(onlineUserIds)
  useMessagesStore.getState().setMessages(messages)
}
