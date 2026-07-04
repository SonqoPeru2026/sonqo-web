import type { APIRoute } from "astro";
import { RESEND_FROM, RESEND_TO, REPORT_TO, CRON_SECRET } from "astro:env/server";
import { resend } from "@/lib/resend";
import { formatSoles } from "@/lib/donation";
import { previousMonthRange } from "@/lib/datetime";
import { getApprovedDonationsByMonth } from "@/lib/donations";
import { buildDonationsWorkbook } from "@/lib/report";
import { captureError } from "@/lib/observability";
import { ok, fail } from "@/lib/responses";

export const prerender = false;

// Cron mensual: Excel de donaciones aprobadas del mes anterior → REPORT_TO (o RESEND_TO).
export const GET: APIRoute = async ({ request }) => {
  // Auth: sin CRON_SECRET (dev) se permite; con él, solo Vercel Cron.
  if (CRON_SECRET) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${CRON_SECRET}`) return fail(401, "no autorizado");
  }

  try {
    // 2. Rango del mes anterior en hora Lima.
    const { start, end, label, slug } = previousMonthRange();

    // 3. Donaciones aprobadas del mes.
    const rows = await getApprovedDonationsByMonth(start, end);

    // 4. Excel.
    const buffer = await buildDonationsWorkbook(rows, label);

    // 5. Email con adjunto.
    const to = REPORT_TO ?? RESEND_TO;
    const total = rows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
    const { error } = await resend.emails.send({
      from: RESEND_FROM,
      to,
      subject: `Reporte de donaciones — ${label}`,
      html:
        `<p>Adjunto el reporte de donaciones aprobadas de <strong>${label}</strong>.</p>` +
        `<p>Total de donaciones: <strong>${rows.length}</strong> · ` +
        `Recaudado: <strong>${formatSoles(total)}</strong></p>` +
        `<p>Generado automáticamente por Sonqo Perú.</p>`,
      attachments: [{ filename: `donaciones-sonqo-${slug}.xlsx`, content: buffer }],
    });

    if (error) {
      captureError(error, { scope: "donations-report", extra: { step: "resend", month: slug } });
      return fail(502, "no se pudo enviar el reporte");
    }

    console.info(`[donations-report] enviado ${slug}: ${rows.length} filas, ${formatSoles(total)}`);
    return ok();
  } catch (err) {
    captureError(err, { scope: "donations-report", extra: { step: "build" } });
    return fail(500, "error generando el reporte");
  }
};
