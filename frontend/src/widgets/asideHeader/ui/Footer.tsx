import { Avatar } from '@gravity-ui/uikit'
import { useSessionStore } from '@/entities/session/model/sessionStore'
import { LogoutButton } from '@/features/auth/logout/ui/LogoutButton'
import { useSocketStore } from '@/shared/store/socketStore'
import styles from './Footer.module.scss'

type Props = {
  compact: boolean
  handleProfile: () => void
}

export const Footer = ({ compact, handleProfile }: Props) => {
  const { status, user } = useSessionStore()
  const { isConnecting, isConnected } = useSocketStore()

  if (status !== 'authenticated') return null

  return (
    <div className={styles['footer']}>
      <div className={styles['footer__profile']} onClick={handleProfile}>
        <Avatar
          text={user?.username ?? 'Аватар'}
          size={compact ? 'm' : 'xl'}
          className={
            isConnecting
              ? styles['footer__avatar--loading']
              : isConnected
                ? styles['footer__avatar--active']
                : styles['footer__avatar--passive']
          }
        />
        {!compact && (
          <div className={styles['footer__info']}>
            <span className={styles['footer__username']}>
              @{user?.username}
            </span>
            <span className={styles['footeк__email']}>{user?.email}</span>
          </div>
        )}
      </div>

      <div className={styles['footer__logout']}>
        <LogoutButton compact={compact} />
      </div>
    </div>
  )
}
