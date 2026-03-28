import { AppError } from './errors'

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AppError) {
    if (error.details && typeof error.details === 'string') {
      return error.details.toLocaleLowerCase()
    }
    return error.message.toLocaleLowerCase()
  }

  return String(error).toLocaleLowerCase()
}
