import type { APIRoute } from "astro";
import { redis } from "@/lib/redis";
import { sumApprovedDonations } from "@/lib/donations";
import { CAMPAIGN_RAISED_KEY, CAMPAIGN_CACHE_TTL } from "@/lib/campaign";

export const prerender = false;

// Total recaudado para la barra de campaña. La home es estática (prerender);
// solo este fetch corre en runtime. El costo escala con donaciones, no con tráfico:
// Redis cachea la suma con TTL corto, así Supabase se consulta rara vez.
export const GET: APIRoute = async () => {
  // 1. Valor caliente desde Redis (1 comando, milisegundos, sin tocar la BD).
  const cached = await redis.get<number>(CAMPAIGN_RAISED_KEY);
  if (cached != null) {
    return json({ raised: Number(cached) });
  }

  // 2. Cache miss: Supabase es la verdad contable. SUM(amount) de lo aprobado.
  const raised = await sumApprovedDonations();
  if (raised == null) {
    // Sin BD: el cliente conserva el valor pintado en el build (degrada sin romper).
    return json({ raised: null });
  }

  // 3. Re-siembra el cache con TTL corto.
  await redis.set(CAMPAIGN_RAISED_KEY, raised, { ex: CAMPAIGN_CACHE_TTL });
  return json({ raised });
};

// Cache HTTP igual al TTL de Redis: ahorra invocaciones cuando hay tráfico.
const json = (data: { raised: number | null }) =>
  Response.json(data, {
    headers: { "Cache-Control": `public, max-age=${CAMPAIGN_CACHE_TTL}` },
  });
