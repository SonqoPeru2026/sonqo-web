// Observabilidad — único punto de contacto con Sentry. Las API routes y libs
// llaman `captureError`, nunca al SDK directo. Si mañana se cambia de proveedor
// se toca SOLO este archivo (mantenible + escalable).
import * as Sentry from "@sentry/astro";
import type { ErrorEvent, EventHint } from "@sentry/astro";

/** Contexto que acompaña a cada error para agruparlo y depurarlo en Sentry. */
export interface ErrorContext {
  /** Origen del error, p.ej. "create-payment". Se indexa como tag. */
  scope: string;
  /** Datos extra NO sensibles (ids, status). Nunca tokens, tarjetas ni emails. */
  extra?: Record<string, unknown>;
}

/**
 * Reporta un error a Sentry con contexto. No-op si Sentry no está inicializado
 * (sin DSN) — degrada sin romper. Nunca lanza: la observabilidad jamás debe
 * tumbar el request que la invoca.
 */
export function captureError(error: unknown, ctx: ErrorContext): void {
  try {
    Sentry.captureException(error, {
      tags: { scope: ctx.scope },
      extra: ctx.extra,
    });
  } catch {
    // Silencioso a propósito: un fallo del reporte no debe afectar la respuesta.
  }
}

// Headers y campos que nunca deben salir hacia Sentry.
const SENSITIVE_HEADERS = ["authorization", "cookie", "x-signature"];

/**
 * `beforeSend` de Sentry: limpia PII antes de que el evento salga. Elimina el
 * cuerpo del request (puede traer token de tarjeta, email, IP), cookies y
 * headers sensibles. Aplica en cliente y servidor.
 */
export function scrubEvent(event: ErrorEvent, _hint: EventHint): ErrorEvent {
  const request = event.request;
  if (request) {
    // El body del request puede contener el token de pago / datos del donante.
    delete request.data;
    delete request.cookies;
    if (request.headers) {
      for (const header of SENSITIVE_HEADERS) {
        delete request.headers[header];
      }
    }
  }
  // No adjuntar datos de usuario aunque el SDK los infiera.
  delete event.user;
  return event;
}
