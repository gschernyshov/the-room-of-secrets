export const ROUTES = {
  main: '/',
  register: '/auth/register',
  login: '/auth/login',
  logout: '/auth/logout',
  createRoom: '/room/create',
  leaveRoom: '/room/leave',
  user: {
    me: '/user/me',
    update: (field: string) => `/user/update/${field}` as const,
  },
  room: {
    user: '/room/user',
  },
} as const
