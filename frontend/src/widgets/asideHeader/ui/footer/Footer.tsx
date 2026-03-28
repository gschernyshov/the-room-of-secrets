import { type RefObject } from 'react'
import { useSessionStore } from '@/entities/session/model/sessionStore'
import { LogoutButton } from '@/features/auth/logout/ui/LogoutButton'
import styles from './Footer.module.scss'
import { Button } from '@gravity-ui/uikit'
import { Avatar } from '@gravity-ui/uikit'

type Props = {
  size: number
  compact: boolean
  asideRef: RefObject<HTMLDivElement>
}
export const Footer = ({ compact }: Props) => {
  const status = useSessionStore(state => state.status)

  if (status !== 'authenticated') return null

  return (
    <div className={styles['footer']}>
      <div className={styles['footer__logout']}>
        <LogoutButton compact={compact} />
      </div>
      <Button view="outlined">
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar text="Charles Darwin" size="l" />
          fkjfkdj
        </span>
      </Button>
    </div>
  )
}
