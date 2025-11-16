import * as Sentry from '@sentry/nextjs'

// Lightweight client-side Sentry init for browser-only code paths
// This file is safe to import from client components
export function initSentryBrowser() {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN && !Sentry.getCurrentHub().getClient()) {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0.0,
      replaysOnErrorSampleRate: 0.1,
      enabled: process.env.NODE_ENV === 'production',
    })
  }
}


