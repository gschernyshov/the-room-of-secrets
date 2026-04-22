export const AppRoutes = {
  HOME: 'home',
  LOGIN: 'login',
  REGISTER: 'register',
  PROFILE: 'profile',
  ROOM: 'room',
  NOT_FOUND: '*',
} as const

export const RoutePath = {
  [AppRoutes.HOME]: '/',
  [AppRoutes.LOGIN]: '/login',
  [AppRoutes.REGISTER]: '/register',
  [AppRoutes.PROFILE]: '/profile',
  [AppRoutes.ROOM]: '/room',
} as const

export const RouteParams = {
  ROOM_ID: ':roomId',
} as const
