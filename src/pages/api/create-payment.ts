import type { APIRoute } from "astro";
import { withinRateLimit } from "@/lib/rate-limit";
import { paymentSchema } from "@/lib/validation/payment";
import { resolveAmount } from "@/lib/donation";
import { getPaymentClient } from "@/lib/mercadopago";
import { insertDonation } from "@/lib/donations";
import { fail } from "@/lib/responses";
import { captureError } from "@/lib/observability";

export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  // IP del donante para la constancia de consentimiento (prueba legal). El getter
  // puede lanzar si el runtime no la expone → degradamos a null sin romper.
  let consentIp: string | null = null;
  try {
    consentIp = clientAddress ?? null;
  } catch {
    consentIp = null;
  }

  // 1. Solo JSON.
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail(400, "Solicitud inválida");
  }

  // 2. Rate limit (clave contra card testing).
  if (!(await withinRateLimit(request, "payment"))) {
    return fail(429, "Demasiados intentos. Espera unos minutos.");
  }

  // 3. Validación del payload del Brick.
  const parsed = paymentSchema.safeParse(body);
  if (!parsed.success) {
    console.warn("[create-payment] validación falló:", parsed.error.issues);
    return fail(400, "Datos de pago inválidos");
  }
  const data = parsed.data;

  // 4. Monto AUTORITATIVO: recalculado en server, nunca el del cliente.
  const amount = resolveAmount({ packageId: data.packageId, amount: data.amount });
  if (amount === null) {
    return fail(400, "Monto de donación inválido");
  }

  // 5. Cliente MP (si faltan keys, degradar con 503).
  const payment = getPaymentClient();
  if (!payment) {
    return fail(503, "Pagos no disponibles por el momento");
  }

  // 6. Crear el pago en MercadoPago.
  try {
    const result = await payment.create({
      body: {
        transaction_amount: amount,
        token: data.token,
        payment_method_id: data.paymentMethodId,
        issuer_id: data.issuerId ? Number(data.issuerId) : undefined, // SDK MP espera número
        installments: data.installments,
        description: "Donación a Sonqo Perú",
        payer: {
          email: data.payer.email,
          identification: data.payer.identification,
        },
      },
      requestOptions: { idempotencyKey: data.token },
    });

    // 7. Registrar el intento (pending/approved/rejected según MP) con el contacto
    // del donante. Best-effort: el pago ya se creó, esto no debe romper la respuesta.
    if (result.id) {
      try {
        await insertDonation({
          paymentId: String(result.id),
          amount,
          currency: "PEN",
          status: result.status ?? "unknown",
          payerEmail: data.payer.email,
          paymentMethod: data.paymentMethodId,
          approvedAt: result.date_approved ?? null,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone ?? null,
          packageId: data.packageId ?? null,
          consentAccepted: data.consent,
          consentAt: new Date().toISOString(),
          consentIp,
        });
      } catch (err) {
        console.error("[create-payment] error registrando donación:", err);
        captureError(err, {
          scope: "create-payment",
          extra: { step: "insert-donation", paymentId: result.id, status: result.status },
        });
      }
    }

    return new Response(
      JSON.stringify({ ok: true, status: result.status, paymentId: result.id }),
      { status: 200, headers: { "content-type": "application/json" } },
    );
  } catch (err) {
    console.error("[create-payment] error:", err);
    captureError(err, { scope: "create-payment", extra: { step: "payment-create" } });
    return fail(502, "No se pudo procesar el pago");
  }
};
