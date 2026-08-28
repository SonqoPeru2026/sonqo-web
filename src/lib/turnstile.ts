import { TURNSTILE_SECRET_KEY } from "astro:env/server";

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

// Dominios donde el widget puede resolverse legítimamente. sonqoperu.com (prod),
// *.vercel.app (previews de develop/PRs, ver CLAUDE.md), localhost (dev).
function isAllowedHostname(hostname: string): boolean {
  return (
    hostname === "sonqoperu.com" ||
    hostname === "www.sonqoperu.com" ||
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.endsWith(".vercel.app")
  );
}

interface SiteverifyResponse {
  success: boolean;
  action?: string;
  hostname?: string;
  "error-codes"?: string[];
}

// Verifica un token de Turnstile contra la API de Cloudflare. Falla cerrado: cualquier
// error de red, respuesta no-2xx, o mismatch de action/hostname → rechaza el request.
export async function verifyTurnstileToken(
  token: unknown,
  expectedAction: string,
  clientIp: string | null,
): Promise<boolean> {
  // Sin secret configurado (dev sin keys todavía) → degradar sin romper, como MP.
  if (!TURNSTILE_SECRET_KEY) return true;

  if (typeof token !== "string" || token.length === 0 || token.length > 2048) {
    return false;
  }

  let result: SiteverifyResponse;
  try {
    const body = new URLSearchParams({ secret: TURNSTILE_SECRET_KEY, response: token });
    if (clientIp) body.set("remoteip", clientIp);

    const res = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return false;
    result = await res.json();
  } catch {
    return false;
  }

  if (!result.success) return false;
  if (result.action !== expectedAction) return false;
  if (!result.hostname || !isAllowedHostname(result.hostname)) return false;

  return true;
}
