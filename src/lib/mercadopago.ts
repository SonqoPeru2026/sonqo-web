import { MercadoPagoConfig, Payment } from "mercadopago";
import { createHmac, timingSafeEqual } from "node:crypto";
import { MP_ACCESS_TOKEN, MP_WEBHOOK_SECRET } from "astro:env/server";

// true si las credenciales están configuradas. Permite degradar sin romper cuando faltan keys.
export const isPaymentsConfigured = Boolean(MP_ACCESS_TOKEN);
export const isWebhookConfigured = Boolean(MP_WEBHOOK_SECRET);

let payment: Payment | null = null;

// Cliente Payment de MercadoPago (singleton). null si aún no hay Access Token.
export function getPaymentClient(): Payment | null {
  if (!MP_ACCESS_TOKEN) return null;
  if (!payment) {
    payment = new Payment(new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN }));
  }
  return payment;
}

// Verifica la firma del webhook de MercadoPago (header x-signature) con HMAC-SHA256.
// Manifest oficial: id:<dataId>;request-id:<requestId>;ts:<ts>;
export function verifyWebhookSignature(opts: {
  dataId: string;
  requestId: string | null;
  signature: string | null;
}): boolean {
  if (!MP_WEBHOOK_SECRET || !opts.signature) return false;

  const parts = Object.fromEntries(
    opts.signature.split(",").map((p) => p.split("=").map((s) => s.trim())),
  );
  const ts = parts.ts;
  const v1 = parts.v1;
  if (!ts || !v1) return false;

  // MP: si data.id es alfanumérico, va en minúsculas (numérico no cambia).
  const manifest = `id:${opts.dataId.toLowerCase()};request-id:${opts.requestId ?? ""};ts:${ts};`;
  const expected = createHmac("sha256", MP_WEBHOOK_SECRET).update(manifest).digest("hex");

  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(v1));
  } catch {
    return false;
  }
}
