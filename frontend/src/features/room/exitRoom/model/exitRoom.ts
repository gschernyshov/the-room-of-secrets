import { useRoomStore } from '@/entities/room/model/roomStore'
import { usePresenceStore } from '@/entities/room/model/presenceStore'
import { roomService } from '@/entities/room/api/roomService'
import { useMessagesStore } from '@/entities/message/model/messagesStore'

export const exitRoom = async (roomId: string) => {
  await roomService.exitRoom(roomId)

  useRoomStore.getState().clear()
  usePresenceStore.getState().clear()
  useMessagesStore.getState().clear()
}
