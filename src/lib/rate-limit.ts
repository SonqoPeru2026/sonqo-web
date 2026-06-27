import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/lib/redis";

// 5 solicitudes por 10 minutos por IP. Sliding window. Estado compartido en Redis
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10 m"),
  prefix: "sonqo/ratelimit",
  analytics: false,
});

// IP real del cliente. En Vercel viene en x-forwarded-for (primer valor de la lista).
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() ?? "unknown";
}

// Devuelve true si la solicitud está dentro del límite. `scope` separa contadores por endpoint.
export async function withinRateLimit(request: Request, scope: string): Promise<boolean> {
  const ip = getClientIp(request);
  const { success } = await ratelimit.limit(`${scope}:${ip}`);
  return success;
}
