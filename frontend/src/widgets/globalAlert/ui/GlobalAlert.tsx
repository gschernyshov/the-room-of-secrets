import { Alert } from '@gravity-ui/uikit'
import { useAlertStore } from '../model/alertStore'
import styles from './GlobalAlert.module.scss'

export const GlobalAlert = () => {
  const { open, type, title, message, closeAlert } = useAlertStore()

  if (!open) return null

  return (
    <div className={styles['container']}>
      <Alert
        theme={type}
        title={title}
        message={message}
        onClose={closeAlert}
      />
    </div>
  )
}
