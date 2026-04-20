import { tokenService } from '../auth/lib/tokenService'
import { AppError } from '../utils/errors'

const API_URL = import.meta.env.VITE_API_URL
const REFRESH_TIMEOUT = 10_000 // Таймаут для запроса обновления токена (10 сек)

// Флаг, указывающий, идёт ли сейчас обновление токена
let isRefreshing = false

// Очередь запросов, заблокированных из-за 401, которые будут перезапущены после обновления токена
let failedQueue: Array<{
  reject: (error: AppError) => void
  resolve: () => void
}> = []

/**
 * Обрабатывает очередь ожидающих запросов
 * Вызывает resolve() для успешного продолжения или reject(error) при ошибке
 */
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

/**
 * Асинхронная функция для выполнения HTTP-запроса с автоматическим обновлением токена
 * Поддерживает проброс signal для отмены запроса
 */
export const apiFetch = async (
  url: RequestInfo,
  init?: RequestInit
): Promise<Response> => {
  const controller = new AbortController()
  const signal = controller.signal

  // Сохраняем оригинальный signal из init, если есть
  const originalSignal = init?.signal

  if (originalSignal) {
    const onAbort = () => controller.abort()

    // Если внешний запрос был отменён — отменяем и наш контроллер
    originalSignal.addEventListener('abort', onAbort)

    // Очищаем слушатель при завершении нашего запроса
    signal.addEventListener('abort', () => {
      originalSignal.removeEventListener('abort', onAbort)
    })
  }

  // Формируем заголовки
  const headers = new Headers(init?.headers)

  // Добавляем Authorization, если есть токен
  const accessToken = tokenService.get()
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }

  // Создаём объект запроса с нужным URL, методом, заголовками и сигналом
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

  // Если статус не 401 — возвращаем ответ как есть
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

    // Если ошибка не связана с аутентификацией (например, 401 c AUTH_FAILED, при вводе
    // неправильных данных (на странице входа)) — возвращаем как есть
    if (errorResult?.error?.type === 'AUTH_FAILED') {
      return response
    }

    // Если уже идёт обновление токена — ставим запрос в очередь
    if (isRefreshing) {
      return new Promise<Response>((resolve, reject) => {
        failedQueue.push({
          resolve: () => apiFetch(url, init).then(resolve, reject),
          reject,
        })
      })
    }

    // Начинаем процесс обновления токена
    isRefreshing = true

    const refreshController = new AbortController()
    const timeoutId = setTimeout(
      () => refreshController.abort(),
      REFRESH_TIMEOUT
    )
    try {
      const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include', // Важно для отправки HTTP-only cookies
        headers: { 'Content-Type': 'application/json' },
        signal: refreshController.signal,
      })

      const refreshResult = await refreshResponse.json()

      if (refreshResult.success) {
        const { newAccessToken } = refreshResult.data

        // Сохраняем новый токен (вызовет колбэк для установки токена в SessionStore через tokenService.set)
        tokenService.set(newAccessToken)

        // Повторяем оригинальный запрос с новым токеном
        const retryHeaders = new Headers(init?.headers)
        retryHeaders.set('Authorization', `Bearer ${newAccessToken}`)

        const retryRequest = new Request(`${API_URL}${url}`, {
          ...init,
          headers: retryHeaders,
          signal,
        })

        const retryResponse = await fetch(retryRequest)

        // Успешно обновили — разрешаем все запросы в очереди
        processQueue(null)

        return retryResponse
      } else {
        throw new AppError(
          'При обновлении токена возникла непредвиденная ошибка',
          refreshResult?.error?.message
        )
      }
    } catch (error) {
      const appError =
        error instanceof AppError
          ? error
          : new AppError('При обновлении сессии возникла ошибка')

      // Уведомляем все запросы в очереди об ошибке
      processQueue(appError)

      // Удаляем токен — пользователь больше не аутентифицирован
      tokenService.remove()

      throw appError
    } finally {
      clearTimeout(timeoutId)
      isRefreshing = false
    }
  }
}
