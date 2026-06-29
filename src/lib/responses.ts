export type ApiSuccess = { ok: true };
export type ApiError = { ok: false; error: string };

function json(data: ApiSuccess | ApiError, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export function ok(): Response {
  return json({ ok: true }, 200);
}

export function fail(status: number, error: string): Response {
  return json({ ok: false, error }, status);
}
