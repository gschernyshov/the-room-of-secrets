import { createElement } from 'react'
import { HomePage } from '@/pages/hoom'
import { LoginPage } from '@/pages/login'
import { RegisterPage } from '@/pages/register'
import { RoomPage } from '@/pages/room'
import { NotFoundPage } from '@/pages/notFound'
import { withAuthRedirect } from '@/features/auth/by-user/config/WithAuthRedirect'
import { AppRoutes } from '@/shared/consts/router'

export const routeConfig = [
  { path: AppRoutes.HOME, element: <HomePage /> },
  { path: AppRoutes.LOGIN, element: <LoginPage /> },
  { path: AppRoutes.REGISTER, element: <RegisterPage /> },
  { path: AppRoutes.ROOM, element: createElement(withAuthRedirect(RoomPage)) },
  { path: AppRoutes.NOT_FOUND, element: <NotFoundPage /> },
]
