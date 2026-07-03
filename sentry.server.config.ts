// Sentry — inicialización del lado servidor (SSR + API routes). Se carga sola
// vía la integración @sentry/astro. Sin DSN no arranca (degrada, como MP/Sanity).
import * as Sentry from "@sentry/astro";
import { scrubEvent } from "@/lib/observability";

const dsn = import.meta.env.PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    // Errores-only: sin performance tracing → cero overhead de CPU (Active CPU
    // de Vercel). Se puede subir a 0.1 más adelante si hace falta (Fase C).
    tracesSampleRate: 0,
    // No enviar PII por defecto. El flujo de pago maneja token de tarjeta,
    // email e IP: se limpian en scrubEvent antes de salir.
    sendDefaultPii: false,
    beforeSend: scrubEvent,
  });
}
