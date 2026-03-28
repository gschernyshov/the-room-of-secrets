import { create } from 'zustand'

export type AlertType = 'info' | 'success' | 'warning' | 'danger'

interface AlertState {
  open: boolean
  type: AlertType | undefined
  title: string | null
  message: string | null
}

interface AlertActions {
  showAlert: (payload: Omit<AlertState, 'open'>) => void
  closeAlert: () => void
}

export type AlertStore = AlertState & AlertActions

export const useAlertStore = create<AlertStore>((set, get) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return {
    open: false,
    type: undefined,
    title: null,
    message: null,

    showAlert: ({ type, title, message }) => {
      if (get().open) {
        get().closeAlert()
      }

      set({ open: true, type, title, message })

      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      timeoutId = setTimeout(
        () => {
          if (get().open) {
            get().closeAlert()
          }
        },
        type === 'danger' ? 5000 : 3000
      )
    },

    closeAlert: () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }

      set({ open: false })
    },
  }
})
