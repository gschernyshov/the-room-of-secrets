import { useCallback } from 'react'
import { useAlertStore, type AlertType } from './alertStore'

export const useShowAlert = () => {
  const { showAlert, closeAlert } = useAlertStore()

  const show = useCallback(
    (type: AlertType, title: string, message: string) => {
      showAlert({ type, title, message })
    },
    [showAlert]
  )

  const infoAlert = useCallback(
    (title: string, message: string) => show('info', title, message),
    [show]
  )
  const successAlert = useCallback(
    (title: string, message: string) => show('success', title, message),
    [show]
  )
  const warningAlert = useCallback(
    (title: string, message: string) => show('warning', title, message),
    [show]
  )
  const errorAlert = useCallback(
    (title: string, message: string = 'Ошибка') =>
      show('danger', title, message),
    [show]
  )

  return {
    infoAlert,
    successAlert,
    warningAlert,
    errorAlert,
    closeAlert,
  }
}
