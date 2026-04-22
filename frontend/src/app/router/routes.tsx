import { HomePage } from '@/pages/hoom'
import { LoginPage } from '@/pages/login'
import { RegisterPage } from '@/pages/register'
import { ProfilePage } from '@/pages/profile'
import { RoomLayout } from '@/features/room/layout'
import { RoomPage } from '@/pages/room'
import { NotFoundPage } from '@/pages/notFound'
import { WithGuestOnly } from '@/features/auth/withGuestOnly/ui/WithGuestOnly'
import { WithAuthRequire } from '@/features/auth/withAuthRequire/ui/WithAuthRequire'
import { AppNavigate } from '@/shared/lib/router/AppNavigate'
import { AppRoutes, RoutePath, RouteParams } from '@/shared/consts/router'

export const routeConfig = [
  {
    title: 'Главная «The Room of Secrets»',
    path: RoutePath[AppRoutes.HOME],
    element: <HomePage />,
  },
  {
    title: 'Вход в «The Room of Secrets»',
    path: RoutePath[AppRoutes.LOGIN],
    element: (
      <WithGuestOnly>
        <LoginPage />
      </WithGuestOnly>
    ),
  },
  {
    title: 'Регистрация в «The Room of Secrets»',
    path: RoutePath[AppRoutes.REGISTER],
    element: (
      <WithGuestOnly>
        <RegisterPage />
      </WithGuestOnly>
    ),
  },
  {
    title: 'Профиль',
    path: RoutePath[AppRoutes.PROFILE],
    element: (
      <WithAuthRequire>
        <ProfilePage />
      </WithAuthRequire>
    ),
  },
  {
    path: RoutePath[AppRoutes.ROOM],
    element: (
      <WithAuthRequire>
        <RoomLayout />
      </WithAuthRequire>
    ),
    children: [
      {
        index: true,
        element: <AppNavigate to={RoutePath[AppRoutes.PROFILE]} replace />,
      },
      {
        path: RouteParams.ROOM_ID,
        element: <RoomPage />,
      },
    ],
  },
  { path: AppRoutes.NOT_FOUND, element: <NotFoundPage /> },
]
