export type SocketCallback<T = void> = (
  response:
    | {
        success: true
        data: T
      }
    | {
        success: false
        error: { message: string }
      }
) => void
