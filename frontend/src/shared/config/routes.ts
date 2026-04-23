export const ROUTES = {
  main: '/',
  register: '/auth/register',
  login: '/auth/login',
  logout: '/auth/logout',
  createRoom: '/room/create',
  leaveRoom: '/room/leave',
  user: {
    update: (field: string) => `/user/update/${field}` as const,
  },
  api: {
    me: '/api/me',
  },
} as const
