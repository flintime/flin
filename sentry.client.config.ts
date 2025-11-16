// Minimal Sentry client config for Next.js.
// The actual initialization is delegated to the shared logger and `initSentryBrowser` helper.
import * as Sentry from '@sentry/nextjs'

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.0,
    replaysOnErrorSampleRate: 0.1,
    enabled: process.env.NODE_ENV === 'production',
  })
}


