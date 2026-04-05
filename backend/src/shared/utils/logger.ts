import { mkdirSync, existsSync, appendFile } from 'fs'
import { join } from 'path'

enum LogLevel {
  PROGRESS = 'PROGRESS',
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
}

type LogLevelStrings = (typeof LogLevel)[keyof typeof LogLevel]

type Color = 'reset' | 'green' | 'yellow' | 'blue' | 'red' | 'magenta'

class Logger {
  private static readonly isDevelopment = process.env.NODE_ENV === 'development'
  private static readonly colors: Record<Color, string> = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m',
    magenta: '\x1b[35m',
  }

  private readonly logFile: string
  private readonly logErrorsFile: string

  constructor(private readonly logsDir = join(process.cwd(), 'logs')) {
    if (!existsSync(logsDir)) {
      mkdirSync(logsDir, { recursive: true })
    }

    this.logFile = join(logsDir, 'app.log')
    this.logErrorsFile = join(logsDir, 'errors.log')
  }

  private logToConsole(color: string, message: string) {
    if (Logger.isDevelopment)
      console.log(`${color}${message}${Logger.colors.reset}`)
  }

  private writeLog(level: LogLevelStrings, message: string) {
    const logEntry = {
      ts: new Date().toISOString(),
      level,
      msg: message,
    }
    const jsonLine = JSON.stringify(logEntry) + '\n'

    appendFile(this.logFile, jsonLine, 'utf-8', _ => {})

    if (level === LogLevel.ERROR) {
      appendFile(this.logErrorsFile, jsonLine, 'utf-8', _ => {})
    }
  }

  progress(msg: string) {
    this.logToConsole(Logger.colors.magenta, msg)
    this.writeLog(LogLevel.PROGRESS, msg)
  }

  info(msg: string) {
    this.logToConsole(Logger.colors.blue, msg)
    this.writeLog(LogLevel.INFO, msg)
  }

  success(msg: string) {
    this.logToConsole(Logger.colors.green, msg)
    this.writeLog(LogLevel.SUCCESS, msg)
  }

  warning(msg: string) {
    this.logToConsole(Logger.colors.yellow, msg)
    this.writeLog(LogLevel.WARNING, msg)
  }

  error(msg: string) {
    this.logToConsole(Logger.colors.red, msg)
    this.writeLog(LogLevel.ERROR, msg)
  }
}

export const logger = new Logger()
