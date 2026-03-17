export class AppError extends Error {
  constructor(
    message: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'AppError'
  }
}
