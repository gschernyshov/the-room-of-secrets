import { type ReactNode } from 'react'
import { useSessionStore } from '@/entities/session/model/sessionStore'
import { AppNavigate } from '@/shared/lib/router/AppNavigate'

type Props = {
  children: ReactNode
  redirectTo?: string
}

/**
 * Разрешает доступ только неавторизованным пользователям.
 * Использует getState(), так как реактивность не нужна —
 * авторизованный пользователь не должен попадать на эти страницы.
 * Это предотвращает конфликты редиректов и даёт страницам
 * самим управлять переходом после входа (через location.state.from).
 */
export const WithGuestOnly = ({ children, redirectTo = '/profile' }: Props) => {
  if (useSessionStore.getState().status === 'authenticated') {
    return <AppNavigate to={redirectTo} replace />
  }

  return children
}
