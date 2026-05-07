import { type AsideHeaderItem } from '@gravity-ui/navigation'
import { Comment } from '@gravity-ui/icons'
import { type Room } from '@/entities/room/model/types'

export const userRoomsMenuItems = (
  compact: boolean,
  rooms: Room[],
  onProfile: (tab?: string) => void,
  onRoom: (id: Room['id']) => void
): AsideHeaderItem[] => {
  if (compact) {
    return [
      {
        id: 'user-rooms',
        type: 'action',
        icon: Comment,
        title: 'Ваши комнаты',
        onItemClickCapture: () => onProfile('rooms'),
        enableTooltip: true,
        tooltipText: 'Нажмите, чтобы посмотреть Ваши комнаты',
      },
    ]
  }

  return rooms.map(room => ({
    id: `user-room-${room.id}`,
    type: 'regular',
    title: `Комната «${room.name}»`,
    onItemClickCapture: () => onRoom(room.id),
    enableTooltip: true,
    tooltipText: `Нажмите, чтобы войти в комнату «${room.name}»`,
  }))
}
