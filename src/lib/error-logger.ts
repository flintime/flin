/**
 * Error logging utility
 * In production, this is wired to Sentry via @sentry/nextjs when DSN is configured.
 */

import * as Sentry from '@sentry/nextjs'

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

export interface LogContext {
  userId?: string
  email?: string
  ip?: string
  userAgent?: string
  url?: string
  [key: string]: unknown
}

class ErrorLogger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  log(level: LogLevel, message: string, error?: Error | unknown, context?: LogContext) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : error,
      context
    }

    // Always log to console in development for easy debugging
    if (this.isDevelopment) {
      console[level](JSON.stringify(logEntry, null, 2))
    }

    // Send to Sentry in production when DSN is configured
    const hasSentry = Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN)
    if (!this.isDevelopment && hasSentry) {
      if (level === LogLevel.ERROR) {
        Sentry.captureException(error || new Error(message), {
          extra: { ...context, level, timestamp: logEntry.timestamp },
        })
      } else {
        Sentry.captureMessage(message, {
          level: level as Sentry.SeverityLevel,
          extra: { ...context, error: logEntry.error, timestamp: logEntry.timestamp },
        })
      }
    }

    // For production environments without Sentry configured, still emit important logs
    if (!this.isDevelopment && !hasSentry && (level === LogLevel.ERROR || level === LogLevel.WARN)) {
      console.error(JSON.stringify(logEntry))
    }
  }

  error(message: string, error?: Error | unknown, context?: LogContext) {
    this.log(LogLevel.ERROR, message, error, context)
  }

  warn(message: string, error?: Error | unknown, context?: LogContext) {
    this.log(LogLevel.WARN, message, error, context)
  }

  info(message: string, context?: LogContext) {
    this.log(LogLevel.INFO, message, undefined, context)
  }

  debug(message: string, context?: LogContext) {
    this.log(LogLevel.DEBUG, message, undefined, context)
  }
}

export const logger = new ErrorLogger()

