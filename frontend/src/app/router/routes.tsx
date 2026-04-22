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
  {
    title: 'Главная «The Room of Secrets»',
    path: AppRoutes.HOME,
    element: <HomePage />,
  },
  {
    title: 'Вход в «The Room of Secrets»',
    path: AppRoutes.LOGIN,
    element: (
      <WithGuestOnly>
        <LoginPage />
      </WithGuestOnly>
    ),
  },
  {
    title: 'Регистрация в «The Room of Secrets»',
    path: AppRoutes.REGISTER,
    element: (
      <WithGuestOnly>
        <RegisterPage />
      </WithGuestOnly>
    ),
  },
  {
    title: 'Профиль',
    path: AppRoutes.PROFILE,
    element: (
      <WithAuthRequire>
        <ProfilePage />
      </WithAuthRequire>
    ),
  },
  {
    title: 'Комната',
    path: AppRoutes.ROOM,
    element: (
      <WithAuthRequire>
        <RoomPage />
      </WithAuthRequire>
    ),
  },
  {
    title: 'Комната',
    path: RoutePath[AppRoutes.ROOM],
    element: (
      <WithAuthRequire>
        <RoomPage />
      </WithAuthRequire>
    ),
  },
  { path: AppRoutes.NOT_FOUND, element: <NotFoundPage /> },
]
