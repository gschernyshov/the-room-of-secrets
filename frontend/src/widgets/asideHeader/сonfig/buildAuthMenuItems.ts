import { type AsideHeaderItem } from '@gravity-ui/navigation'
import { createRoomMenuItem } from '@/features/room/createRoom'
import { userRoomsMenuItems } from '@/features/room/userRooms'
import { type Room } from '@/entities/room/model/types'

type AuthPayload = {
  compact: boolean
  rooms: Room[]
  onProfile: (tab?: string) => void
  onRoom: (id: Room['id']) => void
}

export const buildAuthMenuItems = ({
  compact,
  rooms,
  onProfile,
  onRoom,
}: AuthPayload): AsideHeaderItem[] => [
  ...createRoomMenuItem(),
  ...userRoomsMenuItems(compact, rooms, onProfile, onRoom),
]
