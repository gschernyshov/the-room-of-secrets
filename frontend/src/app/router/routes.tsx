import { HomePage } from '@/pages/hoom'
import { LoginPage } from '@/pages/login'
import { RegisterPage } from '@/pages/register'
import { ProfilePage } from '@/pages/profile'
import { RoomPage } from '@/pages/room'
import { NotFoundPage } from '@/pages/notFound'
import { WithGuestOnly } from '@/features/auth/withGuestOnly/ui/WithGuestOnly'
import { WithAuthRequire } from '@/features/auth/withAuthRequire/ui/WithAuthRequire'
import { AppRoutes, RoutePath } from '@/shared/consts/router'

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
  {
    path: RoutePath[AppRoutes.ROOM],
    element: (
      <WithAuthRequire>
        <RoomPage />
      </WithAuthRequire>
    ),
  },
  { path: AppRoutes.NOT_FOUND, element: <NotFoundPage /> },
]
