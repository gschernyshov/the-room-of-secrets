export const AppRoutes = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  ROOM: '/room',
  NOT_FOUND: '*',
} as const

export const RoutePath = {
  [AppRoutes.ROOM]: '/room/:roomId',
} as const
