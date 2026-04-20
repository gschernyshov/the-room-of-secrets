let onTokenRefreshed: ((token: string | null) => void) | null = null

export const setOnTokenRefreshed = (
  callback: (token: string | null) => void
) => {
  onTokenRefreshed = callback
}

export const tokenService = {
  get: (): string | null => {
    return localStorage.getItem('accessToken')
  },

  cleanSet: (token: string): void => {
    localStorage.setItem('accessToken', token)
  },

  cleanRemove: (): void => {
    localStorage.removeItem('accessToken')
  },

  set: (token: string): void => {
    localStorage.setItem('accessToken', token)
    if (onTokenRefreshed) onTokenRefreshed(token)
  },

  remove: (): void => {
    localStorage.removeItem('accessToken')
    if (onTokenRefreshed) onTokenRefreshed(null)
  },
}
