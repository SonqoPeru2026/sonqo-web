import type { APIRoute } from "astro";
import { pingDatabase } from "@/lib/donations";

export const prerender = false;

// Keepalive: un cron toca la BD para que Supabase free no se pause por inactividad.
export const GET: APIRoute = async () => {
  const alive = await pingDatabase();
  return new Response(JSON.stringify({ ok: alive }), {
    status: alive ? 200 : 503,
    headers: { "content-type": "application/json" },
  });
};
