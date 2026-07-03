import type { APIRoute } from "astro";
import { render } from "@react-email/render";
import { RESEND_FROM, RESEND_TO } from "astro:env/server";
import { resend } from "@/lib/resend";
import { supabase } from "@/lib/supabase";
import { withinRateLimit } from "@/lib/rate-limit";
import { isHoneypotTriggered } from "@/lib/honeypot";
import { makeLeadSchema } from "@/lib/validation/lead";
import { LeadInternal } from "@/components/emails/LeadInternal";
import { LeadUser } from "@/components/emails/LeadUser";
import { ok, fail } from "@/lib/responses";
import { nowInLima } from "@/lib/datetime";
import { captureError } from "@/lib/observability";

export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  // IP para la constancia de consentimiento (prueba legal). Getter puede lanzar → null.
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

  // 2. Honeypot: bot → ok falso sin procesar.
  if (isHoneypotTriggered((body as { website?: unknown })?.website)) {
    return ok();
  }

  // 3. Rate limit por IP.
  if (!(await withinRateLimit(request, "infographic"))) {
    return fail(429, "Demasiados intentos. Espera unos minutos.");
  }

  // 4. Validación estricta.
  const parsed = makeLeadSchema().safeParse(body);
  if (!parsed.success) {
    console.warn("[infographic] validación falló:", parsed.error.issues);
    return fail(400, "Datos inválidos");
  }
  const { name, email, phone, source } = parsed.data;

  // 5. Guardar lead en Supabase (requerido). RLS permite solo INSERT con la anon key.
  try {
    const { error } = await supabase.from("leads").insert({ name, email, phone, source });
    if (error) {
      console.error("[infographic] Supabase error:", error);
      captureError(error, { scope: "infographic", extra: { step: "supabase-insert" } });
      return fail(500, "No se pudo registrar tu solicitud");
    }
  } catch (err) {
    console.error("[infographic] error (supabase):", err);
    captureError(err, { scope: "infographic", extra: { step: "supabase-insert" } });
    return fail(500, "No se pudo registrar tu solicitud");
  }

  // 6. Email interno al equipo (best-effort: el lead ya quedó guardado).
  try {
    const html = await render(
      LeadInternal({ name, email, phone, source, receivedAt: nowInLima(), consentIp }),
    );
    const { error } = await resend.emails.send({
      from: RESEND_FROM,
      to: RESEND_TO,
      replyTo: email,
      subject: `Nuevo lead de infografía: ${name}`,
      html,
    });
    if (error) console.warn("[infographic] Resend (interno) no entregado:", error);
  } catch (err) {
    console.warn("[infographic] error (interno):", err);
  }

  // 7. Email con la infografía al usuario (best-effort).
  try {
    const html = await render(LeadUser({ name }));
    const { error } = await resend.emails.send({
      from: RESEND_FROM,
      to: email,
      subject: "Tu infografía de Sonqo está lista",
      html,
    });
    if (error) console.warn("[infographic] Resend (usuario) no entregado:", error);
  } catch (err) {
    console.warn("[infographic] error (usuario):", err);
  }

  return ok();
};
