import type { APIRoute } from "astro";
import { render } from "@react-email/render";
import { redis } from "@/lib/redis";
import { getPaymentClient, verifyWebhookSignature, isWebhookConfigured } from "@/lib/mercadopago";
import { updateDonationStatus, getDonationContact } from "@/lib/donations";
import { resend } from "@/lib/resend";
import { RESEND_FROM, RESEND_TO } from "astro:env/server";
import { DonationThanks } from "@/components/emails/DonationThanks";
import { DonationInternal } from "@/components/emails/DonationInternal";

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

    // Actualiza solo el status (la fila y el contacto ya los creó create-payment.ts).
    const paymentId = String(payment.id ?? dataId);
    await updateDonationStatus(paymentId, payment.status ?? "unknown", payment.date_approved ?? null);

    // Emails de donación aprobada: agradecimiento al donante + aviso al equipo.
    // Best-effort (try/catch propio cada uno; no deben romper el 200 a MP).
    if (payment.status === "approved") {
      const contact = await getDonationContact(paymentId);
      const payerEmail = contact?.payerEmail ?? payment.payer?.email ?? null;
      const approvedAt = payment.date_approved ?? new Date().toISOString();
      const amount = payment.transaction_amount ?? 0;
      const last4 = payment.card?.last_four_digits ?? null;

      if (payerEmail) {
        try {
          const html = await render(
            DonationThanks({
              firstName: contact?.firstName ?? "",
              packageId: contact?.packageId ?? null,
              amount,
              approvedAt,
              last4,
              paymentId,
            }),
          );
          const { error } = await resend.emails.send({
            from: RESEND_FROM,
            to: payerEmail,
            subject: "Gracias por tu donación a Sonqo Perú",
            html,
          });
          if (error) console.warn("[mp-webhook] Resend (agradecimiento) no entregado:", error);
        } catch (err) {
          console.warn("[mp-webhook] error enviando agradecimiento:", err);
        }
      }

      try {
        const html = await render(
          DonationInternal({
            firstName: contact?.firstName ?? "",
            lastName: contact?.lastName ?? "",
            email: payerEmail ?? "",
            phone: contact?.phone ?? null,
            amount,
            packageId: contact?.packageId ?? null,
            last4,
            paymentId,
            approvedAt,
            consentAccepted: contact?.consentAccepted ?? false,
            consentAt: contact?.consentAt ?? null,
            consentIp: contact?.consentIp ?? null,
          }),
        );
        const { error } = await resend.emails.send({
          from: RESEND_FROM,
          to: RESEND_TO,
          subject: `Nueva donación: ${contact?.firstName ?? "Donante"} — S/ ${amount.toFixed(2)}`,
          html,
        });
        if (error) console.warn("[mp-webhook] Resend (interno) no entregado:", error);
      } catch (err) {
        console.warn("[mp-webhook] error enviando aviso interno:", err);
      }
    }

    await redis.set(key, 1, { ex: 86400 }); // marca procesado (24h)
  } catch (err) {
    console.error("[mp-webhook] error consultando el pago:", err);
    return new Response("error", { status: 500 }); // MP reintentará
  }

  return okResponse();
};
