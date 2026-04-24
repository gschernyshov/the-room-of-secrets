import { type AsideHeaderItem } from '@gravity-ui/navigation'
import { PersonPlus } from '@gravity-ui/icons'
import { AppRoutes, RoutePath } from '@/shared/consts/router'

export const registerMenuItem = (onRegister: () => void): AsideHeaderItem[] => {
  return [
    {
      id: RoutePath[AppRoutes.REGISTER],
      type: 'action',
      icon: PersonPlus,
      title: 'Регистрация',
      onItemClickCapture: onRegister,
      enableTooltip: true,
      tooltipText: 'Зарегистироваться на платформе',
    },
  ]
}
