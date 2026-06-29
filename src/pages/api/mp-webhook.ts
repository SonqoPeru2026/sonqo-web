import type { APIRoute } from "astro";
import { redis } from "@/lib/redis";
import { getPaymentClient, verifyWebhookSignature, isWebhookConfigured } from "@/lib/mercadopago";
import { recordDonation } from "@/lib/donations";

export const prerender = false;

// Respuesta rápida: MercadoPago reintenta si no recibe 2xx.
const okResponse = () => new Response("ok", { status: 200 });

export const POST: APIRoute = async ({ request, url }) => {
  // 1. data.id y tipo: pueden venir por query o por body.
  let dataId = url.searchParams.get("data.id") ?? url.searchParams.get("id");
  let type = url.searchParams.get("type") ?? url.searchParams.get("topic");

  try {
    const body = (await request.json()) as { type?: string; data?: { id?: string } };
    dataId = dataId ?? body?.data?.id ?? null;
    type = type ?? body?.type ?? null;
  } catch {
    // Algunas notificaciones no traen body JSON.
  }

  if (!dataId) return okResponse();
  if (type && type !== "payment") return okResponse(); // solo pagos

  // 2. Verificar la firma del webhook.
  const valid = verifyWebhookSignature({
    dataId: String(dataId),
    requestId: request.headers.get("x-request-id"),
    signature: request.headers.get("x-signature"),
  });
  if (!valid) {
    if (isWebhookConfigured) {
      return new Response("invalid signature", { status: 401 });
    }
    // Sin secret aún: aceptamos pero no procesamos (no podemos confiar).
    console.warn("[mp-webhook] secret ausente, notificación omitida");
    return okResponse();
  }

  // 3. Idempotencia: no procesar dos veces el mismo pago.
  const key = `mp:processed:${dataId}`;
  if (await redis.get(key)) return okResponse();

  // 4. Consultar el estado real del pago en MercadoPago (fuente de verdad).
  const client = getPaymentClient();
  if (!client) return okResponse();

  try {
    const payment = await client.get({ id: String(dataId) });
    console.info(`[mp-webhook] pago ${dataId} → ${payment.status}`);

    // Solo registramos donaciones efectivamente aprobadas.
    if (payment.status === "approved") {
      await recordDonation({
        paymentId: String(payment.id ?? dataId),
        amount: payment.transaction_amount ?? 0,
        currency: payment.currency_id ?? "PEN",
        status: payment.status,
        payerEmail: payment.payer?.email ?? null,
        paymentMethod: payment.payment_method_id ?? null,
        approvedAt: payment.date_approved ?? null,
      });
    }

    await redis.set(key, 1, { ex: 86400 }); // marca procesado (24h)
  } catch (err) {
    console.error("[mp-webhook] error consultando el pago:", err);
    return new Response("error", { status: 500 }); // MP reintentará
  }

  return okResponse();
};
