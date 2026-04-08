import { Button, Icon } from '@gravity-ui/uikit'
import { ArrowRightFromSquare } from '@gravity-ui/icons'
import { useLogout } from '../lib/useLogout'
import { useShowAlert } from '@/widgets/globalAlert'
import { getErrorMessage } from '@/shared/utils/getErrorMessage'
import styles from './LogoutButton.module.scss'

type Props = {
  compact?: boolean
}

export const LogoutButton = ({ compact }: Props) => {
  const { isLoading, handleLogout } = useLogout()
  const { successAlert, errorAlert } = useShowAlert()

  const onLogout = async () => {
    if (isLoading) return

    try {
      await handleLogout()
      successAlert('Выход из системы', 'Вы успешно вышли из системы')
    } catch (error) {
      errorAlert('Ошибка при выходе из системы', getErrorMessage(error))
    }
  }

  return (
    <Button
      view="outlined"
      size="l"
      pin="circle-circle"
      disabled={isLoading}
      loading={isLoading}
      onClick={onLogout}
      className={styles['logout-button']}
    >
      {compact && <Icon data={ArrowRightFromSquare} size={18} />}
      <Icon data={ArrowRightFromSquare} size={18} />
      {!compact && (isLoading ? 'Выход...' : 'Выйти')}
    </Button>
  )
}
