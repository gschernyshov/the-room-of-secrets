import { type AsideHeaderItem } from '@gravity-ui/navigation'
import { CommentPlus } from '@gravity-ui/icons'
import { CreateRoomPopup } from '../ui/CreateRoomPopup'

export const createRoomMenuItem = (): AsideHeaderItem[] => {
  return [
    {
      id: 'create-room',
      type: 'action',
      icon: CommentPlus,
      title: 'Создать комнату',
      enableTooltip: true,
      tooltipText: 'Нажмите, чтобы создать комнату',

      itemWrapper: (params, makeItem) => {
        const content = makeItem(params)

        return <CreateRoomPopup content={content} />
      },
    },
  ]
}
