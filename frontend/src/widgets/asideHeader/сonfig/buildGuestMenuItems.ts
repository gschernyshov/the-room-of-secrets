import { type AsideHeaderItem } from '@gravity-ui/navigation'
import { loginMenuItem } from '@/features/auth/login'
import { registerMenuItem } from '@/features/auth/register'

type GuestPayload = {
  onLogin: () => void
  onRegister: () => void
}

export const buildGuestMenuItems = ({
  onLogin,
  onRegister,
}: GuestPayload): AsideHeaderItem[] => [
  ...loginMenuItem(onLogin),
  ...registerMenuItem(onRegister),
]
