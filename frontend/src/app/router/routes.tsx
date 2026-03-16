import { HomePage } from '@/pages/hoom'
import { LoginPage } from '@/pages/login'
import { RegisterPage } from '@/pages/register'
import { ProfilePage } from '@/pages/profile'
import { RoomPage } from '@/pages/room'
import { NotFoundPage } from '@/pages/notFound'
import { WithAuthRequire } from '@/features/auth/WithAuthRequire/ui/WithAuthRequire'
import { AppRoutes } from '@/shared/consts/router'
import { WithGuestOnly } from '@/features/auth/WithGuestOnly/WithGuestOnly'

export const routeConfig = [
  { path: AppRoutes.HOME, element: <HomePage /> },
  {
    path: AppRoutes.LOGIN,
    element: (
      <WithGuestOnly>
        <LoginPage />
      </WithGuestOnly>
    ),
  },
  {
    path: AppRoutes.REGISTER,
    element: (
      <WithGuestOnly>
        <RegisterPage />
      </WithGuestOnly>
    ),
  },
  {
    path: AppRoutes.PROFILE,
    element: (
      <WithAuthRequire>
        <ProfilePage />
      </WithAuthRequire>
    ),
  },
  {
    path: AppRoutes.ROOM,
    element: (
      <WithAuthRequire>
        <RoomPage />
      </WithAuthRequire>
    ),
  },
  { path: AppRoutes.NOT_FOUND, element: <NotFoundPage /> },
]
