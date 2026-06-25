// Honeypot: campo oculto `website` en el form. Un humano lo deja vacío; un bot lo llena.
// Si viene con contenido, tratamos la solicitud como bot.
export function isHoneypotTriggered(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}
