import { AppRoutes, RoutePath } from '@/shared/consts/router'

export const ID_TO_ROUTE: Record<string, string> = {
  login: RoutePath[AppRoutes.LOGIN],
  register: RoutePath[AppRoutes.REGISTER],
}
