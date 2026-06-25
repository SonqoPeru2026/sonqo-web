import type { APIRoute } from "astro";
import { render } from "@react-email/render";
import { RESEND_FROM, RESEND_TO } from "astro:env/server";
import { resend } from "@/lib/resend";
import { withinRateLimit } from "@/lib/rate-limit";
import { isHoneypotTriggered } from "@/lib/honeypot";
import { makeContactSchema } from "@/lib/validation/contact";
import { ContactInternal } from "@/components/emails/ContactInternal";
import { ContactUser } from "@/components/emails/ContactUser";
import { ok, fail } from "@/lib/responses";
import { nowInLima } from "@/lib/datetime";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  // 1. Solo JSON.
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail(400, "Solicitud inválida");
  }

  // 2. Honeypot: bot detectado → respondemos ok sin procesar (no revelar el filtro).
  if (isHoneypotTriggered((body as { website?: unknown })?.website)) {
    return ok();
  }

  // 3. Rate limit por IP.
  if (!(await withinRateLimit(request, "contact"))) {
    return fail(429, "Demasiados intentos. Espera unos minutos.");
  }

  // 4. Validación estricta.
  const parsed = makeContactSchema().safeParse(body);
  if (!parsed.success) {
    console.warn("[contact] validación falló:", parsed.error.issues);
    return fail(400, "Datos inválidos");
  }
  const { name, email, phone, message } = parsed.data;

  // 5. Email interno al equipo (requerido). Si falla, la solicitud falla.
  try {
    const html = await render(
      ContactInternal({ name, email, phone, message, receivedAt: nowInLima() }),
    );
    const { error } = await resend.emails.send({
      from: RESEND_FROM,
      to: RESEND_TO,
      replyTo: email,
      subject: `Nuevo contacto: ${name}`,
      html,
    });
    if (error) {
      console.error("[contact] Resend (interno) error:", error);
      return fail(500, "No se pudo enviar el mensaje");
    }
  } catch (err) {
    console.error("[contact] error (interno):", err);
    return fail(500, "No se pudo enviar el mensaje");
  }

  // 6. Email de confirmación al usuario (best-effort: no rompe la solicitud si falla,
  //    p.ej. en dev Resend solo entrega al correo dueño de la cuenta).
  try {
    const html = await render(ContactUser({ name, email, phone, message }));
    const { error } = await resend.emails.send({
      from: RESEND_FROM,
      to: email,
      subject: "Hemos recibido tu mensaje · Sonqo Perú",
      html,
    });
    if (error) console.warn("[contact] Resend (usuario) no entregado:", error);
  } catch (err) {
    console.warn("[contact] error (usuario):", err);
  }

  return ok();
};
