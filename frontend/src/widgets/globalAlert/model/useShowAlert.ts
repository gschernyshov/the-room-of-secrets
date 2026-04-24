import { useAlertStore, type AlertType } from './alertStore'

export const useShowAlert = () => {
  const { showAlert, closeAlert } = useAlertStore()

  const show = (type: AlertType, title: string, message: string) => {
    showAlert({ type, title, message })
  }

  const infoAlert = (title: string, message: string) =>
    show('info', title, message)
  const successAlert = (title: string, message: string) =>
    show('success', title, message)
  const warningAlert = (title: string, message: string) =>
    show('warning', title, message)
  const errorAlert = (title: string, message: string = 'Ошибка') =>
    show('danger', title, message)

  return {
    infoAlert,
    successAlert,
    warningAlert,
    errorAlert,
    closeAlert,
  }
}
