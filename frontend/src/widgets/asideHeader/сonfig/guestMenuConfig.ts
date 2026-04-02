import { ArrowRightToSquare, PersonPlus } from '@gravity-ui/icons'
import { type AsideHeaderItem } from '@gravity-ui/navigation'

export const buildGuestMenuItems = ({
  onLogin,
  onRegister,
}: {
  onLogin: () => void
  onRegister: () => void
}): AsideHeaderItem[] => [
  {
    id: 'login',
    type: 'action',
    icon: ArrowRightToSquare,
    title: 'Вход',
    onItemClickCapture: onLogin,
    enableTooltip: true,
    tooltipText: 'Войти в личный кабинет',
  },
  {
    id: 'register',
    type: 'action',
    icon: PersonPlus,
    title: 'Регистрация',
    onItemClickCapture: onRegister,
    enableTooltip: true,
    tooltipText: 'Зарегистироваться на платформе',
  },
]
