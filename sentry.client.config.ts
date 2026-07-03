// Sentry — inicialización del lado cliente (islas React, p.ej. PaymentBrick).
// Errores-only: sin Session Replay ni tracing → bundle mínimo (sitio rápido).
// Sin DSN no arranca.
import * as Sentry from "@sentry/astro";
import { scrubEvent } from "@/lib/observability";

const dsn = import.meta.env.PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    tracesSampleRate: 0,
    sendDefaultPii: false,
    beforeSend: scrubEvent,
  });
}
