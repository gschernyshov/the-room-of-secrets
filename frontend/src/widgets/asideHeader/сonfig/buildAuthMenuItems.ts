import { type AsideHeaderItem } from '@gravity-ui/navigation'
import { createRoomMenuItem } from '@/features/room/createRoom'

export const buildAuthMenuItems = (): AsideHeaderItem[] => [
  ...createRoomMenuItem(),
]
