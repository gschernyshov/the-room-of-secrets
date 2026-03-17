import { AppError } from '../utils/errors'

const API_URL = import.meta.env.VITE_API_URL
const REFRESH_TIMEOUT = 10_000

let isRefreshing = false
let failedQueue: Array<{
  reject: (error: AppError) => void
  resolve: () => void
}> = []

const processQueue = (error: AppError | null) => {
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error)
    } else {
      promise.resolve()
    }
  })
  failedQueue = []
}

export const apiFetch = async (
  url: RequestInfo,
  init?: RequestInit
): Promise<Response> => {
  const controller = new AbortController()
  const signal = controller.signal

  const originalSignal = init?.signal

  if (originalSignal) {
    const onAbort = () => controller.abort()

    originalSignal.addEventListener('abort', onAbort)

    signal.addEventListener('abort', () => {
      originalSignal.removeEventListener('abort', onAbort)
    })
  }

  const headers = new Headers(init?.headers)

  const accessToken = localStorage.getItem('accessToken')
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }

  const request = new Request(`${API_URL}${url}`, {
    ...init,
    headers,
    signal,
  })

  let response: Response
  try {
    response = await fetch(request)
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new AppError('Возникла ошибка: запрос был отменён')
    }
    throw new AppError('Возникла ошибка сети. Проверьте подключение')
  }

  if (response.status !== 401) {
    return response
  } else {
    // Клонируем response для чтения тела ответа (так как оно может быть прочитано только один раз)
    const errorResponse = response.clone()

    let errorResult
    try {
      errorResult = await errorResponse.json()
    } catch {
      throw new AppError('Не удалось распарсить тело ответа сервера')
    }

    if (errorResult?.error?.type === 'AUTH_FAILED') {
      return response
    }

    if (isRefreshing) {
      return new Promise<Response>((resolve, reject) => {
        failedQueue.push({
          resolve: () => apiFetch(url, init).then(resolve, reject),
          reject,
        })
      })
    }

    isRefreshing = true

    const refreshController = new AbortController()
    const timeoutId = setTimeout(
      () => refreshController.abort(),
      REFRESH_TIMEOUT
    )
    try {
      const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        signal: refreshController.signal,
      })

      const refreshResult = await refreshResponse.json()

      if (refreshResult.success) {
        const { newAccessToken } = refreshResult.data

        localStorage.setItem('accessToken', newAccessToken)

        const retryHeaders = new Headers(init?.headers)
        retryHeaders.set('Authorization', `Bearer ${newAccessToken}`)

        const retryRequest = new Request(`${API_URL}${url}`, {
          ...init,
          headers: retryHeaders,
          signal,
        })

        const retryResponse = await fetch(retryRequest)

        processQueue(null)

        return retryResponse
      } else {
        throw new AppError(
          refreshResult?.error?.message || 'Не удалось обновить токен'
        )
      }
    } catch (error) {
      const appError =
        error instanceof AppError
          ? error
          : new AppError('При обновлении сессии возникла ошибка')

      processQueue(appError)
      localStorage.removeItem('accessToken')

      throw appError
    } finally {
      clearTimeout(timeoutId)
      isRefreshing = false
    }
  }
}
