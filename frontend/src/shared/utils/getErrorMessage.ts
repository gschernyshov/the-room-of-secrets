import { AppError } from './errors'

export const getErrorMessage = (error: unknown): string => {
  if (!(error instanceof AppError)) {
    return 'Произошла непредвиденная ошибка'
  }

  const errorDetails = error.details

  if (Array.isArray(errorDetails)) {
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
          if (rootErrorMessage) {
            rootErrorMessage += '. '
          }
          rootErrorMessage += message
        }
      }
    })

    return rootErrorMessage
  }

  if (typeof errorDetails === 'string') {
    return errorDetails
  }

  return error.message
}
