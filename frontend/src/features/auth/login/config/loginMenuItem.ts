import { type AsideHeaderItem } from '@gravity-ui/navigation'
import { ArrowRightToSquare } from '@gravity-ui/icons'
import { AppRoutes, RoutePath } from '@/shared/consts/router'

export const loginMenuItem = (onLogin: () => void): AsideHeaderItem[] => {
  return [
    {
      id: RoutePath[AppRoutes.LOGIN],
      type: 'action',
      icon: ArrowRightToSquare,
      title: 'Вход',
      onItemClickCapture: onLogin,
      enableTooltip: true,
      tooltipText: 'Войти в личный кабинет',
    },
  ]
}
