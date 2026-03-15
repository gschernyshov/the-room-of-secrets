import { HomePage } from '@/pages/hoom'
import { LoginPage } from '@/pages/login'
import { RegisterPage } from '@/pages/register'
import { ProfilePage } from '@/pages/profile'
import { RoomPage } from '@/pages/room'
import { NotFoundPage } from '@/pages/notFound'
import { AppRoutes } from '@/shared/consts/router'

export const routeConfig = [
  { path: AppRoutes.HOME, element: <HomePage /> },
  { path: AppRoutes.LOGIN, element: <LoginPage /> },
  { path: AppRoutes.REGISTER, element: <RegisterPage /> },
  { path: AppRoutes.PROFILE, element: <ProfilePage /> },
  { path: AppRoutes.ROOM, element: <RoomPage /> },
  { path: AppRoutes.NOT_FOUND, element: <NotFoundPage /> },
]
