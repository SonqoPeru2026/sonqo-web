// Fecha/hora legible en horario de Perú (para emails internos).
export function nowInLima(): string {
  return (
    new Intl.DateTimeFormat("es-PE", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "America/Lima",
    }).format(new Date()) + " PE"
  );
}
