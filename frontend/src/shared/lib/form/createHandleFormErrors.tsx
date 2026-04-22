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
  return (error: unknown): boolean => {
    // Возвращаем флаг, чтобы сообщить "известного" ли типа ошибка

    if (!(error instanceof AppError)) {
      setError('root', {
        type: 'server',
        message: 'Произошла непредвиденная ошибка',
      })
      return false
    }

    const errorDetails = error.details

    if (Array.isArray(errorDetails)) {
      let hasErrors = false
      let rootErrorMessage = ''

      errorDetails.forEach(errorDetail => {
        if (
          errorDetail &&
          typeof errorDetail === 'object' &&
          ('path' in errorDetail || 'param' in errorDetail) &&
          'msg' in errorDetail
        ) {
          const path = errorDetail.path || errorDetail.param
          const message = errorDetail.msg

          if (typeof path === 'string' && typeof message === 'string') {
            if (fieldNames.includes(path)) {
              setError(path as Path<T>, {
                type: 'server',
                message,
              })
              hasErrors = true
            } else {
              if (rootErrorMessage) {
                rootErrorMessage += '. '
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

    if (typeof errorDetails === 'string') {
      setError('root', {
        type: 'server',
        message: errorDetails,
      })
      return true
    }

    setError('root', {
      type: 'server',
      message: error.message,
    })
    return false
  }
}

/**
* Примеры ошибок с сервера:
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
* или
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
