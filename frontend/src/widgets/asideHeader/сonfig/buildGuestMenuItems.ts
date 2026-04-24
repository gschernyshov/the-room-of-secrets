import { type AsideHeaderItem } from '@gravity-ui/navigation'
import { loginMenuItem } from '@/features/auth/login/config/loginMenuItem'
import { registerMenuItem } from '@/features/auth/register/config/registerMenuItem'

type GuestActions = {
  onLogin: () => void
  onRegister: () => void
}

export const buildGuestMenuItems = ({
  onLogin,
  onRegister,
}: GuestActions): AsideHeaderItem[] => [
  ...loginMenuItem(onLogin),
  ...registerMenuItem(onRegister),
]
