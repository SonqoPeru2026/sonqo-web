import type { APIRoute } from "astro";
import { pingDatabase } from "@/lib/donations";
import { isAuthorizedCron } from "@/lib/cron-auth";
import { fail } from "@/lib/responses";

export const prerender = false;

// Keepalive: un cron toca la BD para que Supabase free no se pause por inactividad.
// Solo Vercel Cron: si fuera público, cualquiera podría consumir la cuota de Supabase.
export const GET: APIRoute = async ({ request }) => {
  if (!isAuthorizedCron(request)) return fail(401, "no autorizado");

  const alive = await pingDatabase();
  return new Response(JSON.stringify({ ok: alive }), {
    status: alive ? 200 : 503,
    headers: { "content-type": "application/json" },
  });
};
