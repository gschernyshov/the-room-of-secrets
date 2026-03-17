import {
  type FieldValues,
  type UseFormSetError,
  type Path,
} from 'react-hook-form'
import { AppError } from '@/shared/utils/errors'

export const createHandleFormErrors = <T extends FieldValues>(
  fieldNames: readonly (keyof T)[],
  setError: UseFormSetError<T>
) => {
  const UNEXPECTED_ERROR = {
    type: 'server',
    message: 'Произошла непредвиденная ошибка',
  } as const

  return (error: unknown): boolean => {
    // Возвращаем флаг, чтобы сообщить "известного" ли типа ошибка

    if (!(error instanceof AppError)) {
      setError('root', UNEXPECTED_ERROR)
      return false
    }

    const errors = error.details

    if (Array.isArray(errors)) {
      let hasErrors = false
      let rootErrorMessage = ''

      errors.forEach(error => {
        if (
          error &&
          typeof error === 'object' &&
          ('path' in error || 'param' in error) &&
          'msg' in error
        ) {
          const path = error.path || error.param
          const message = error.msg

          if (typeof path === 'string' && typeof message === 'string') {
            if (fieldNames.includes(path)) {
              setError(path as Path<T>, {
                type: 'server',
                message,
              })
              hasErrors = true
            } else {
              if (rootErrorMessage) {
                rootErrorMessage += '\n'
              }
              rootErrorMessage += message
            }
          }
        }

        if (rootErrorMessage) {
          setError('root', {
            type: 'server',
            message: rootErrorMessage,
          })
          hasErrors = true
        }
      })

      return hasErrors
    }

    if (typeof errors === 'string') {
      setError('root', {
        type: 'server',
        message: errors,
      })
      return true
    }

    setError('root', UNEXPECTED_ERROR)
    return false
  }
}

/*
Примеры ошибок с сервера:

1.

{
  "success": false,
  "error": {
    "message": [
      {
        "type": "field",
        "value": "invalid-email",
        "msg": "Некорректный email",
        "path": "email",
        "location": "body"
      },
      {
        "type": "field",
        "value": "",
        "msg": "Пароль должен быть не менее 6 символов",
        "path": "password",
        "location": "body"
      }
    ]
  }
}

2.

{
  success: false,
  error: {
    message: [
      {
        "type": "field",
        "msg": "Refresh token обязателен",
        "path": "refreshToken",
        "location": "cookies"
      }
    ]
  }
*/
