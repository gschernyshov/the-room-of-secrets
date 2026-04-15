import clsx from 'clsx'
import { Avatar } from '@gravity-ui/uikit'
import { TABS } from '../model/tab'
import { useProfileCardStore } from '../model/profileCardStore'
import { useInitProfileStore } from '../lib/useInitProfileStore'
import { ChangeInfo } from '@/features/user/changeInfo'
import { ChangePassword } from '@/features/user/changePassword'
import { useSessionStore } from '@/entities/session/model/sessionStore'
import styles from './ProfileCard.module.scss'

export const ProfileCard = () => {
  useInitProfileStore()

  const { user } = useSessionStore()
  const { activeTab, setActiveTab } = useProfileCardStore()

  return (
    <div className={styles['profile-card']}>
      <div className={styles['profile-card__header']}>
        <Avatar text={user?.username ?? 'Аватар'} size="xl" />

        <div className={styles['profile-card__info']}>
          <span className={styles['profile-card__username']}>
            @{user?.username}
          </span>
          <span className={styles['profile-card__email']}>{user?.email}</span>
        </div>
      </div>

      <div className={styles['profile-card__tabs']}>
        {TABS.map(tab => (
          <div
            key={tab.id}
            className={clsx(
              styles['profile-card__tab'],
              activeTab === tab.id && styles['profile-card__tab--active']
            )}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </div>

      <div className={styles['profile-card__content']}>
        {activeTab === 'profile' && <ChangeInfo />}
        {activeTab === 'password' && <ChangePassword />}
        {activeTab === 'rooms' && <p>Комнаты</p>}
      </div>
    </div>
  )
}
