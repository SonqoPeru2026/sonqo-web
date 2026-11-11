import { CRON_SECRET } from "astro:env/server";

// Autoriza endpoints que solo debe invocar Vercel Cron (manda `Authorization: Bearer <CRON_SECRET>`).
// Falla cerrado en producción: si falta CRON_SECRET, nadie pasa (nunca queda abierto en silencio).
// En dev sin secret se permite, para probar el endpoint en local.
export function isAuthorizedCron(request: Request): boolean {
  if (!CRON_SECRET) return !import.meta.env.PROD;
  return request.headers.get("authorization") === `Bearer ${CRON_SECRET}`;
}
