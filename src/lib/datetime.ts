const LIMA_TZ = "America/Lima";

// Offset fijo de Perú respecto a UTC (Perú no usa horario de verano: siempre -05:00).
const LIMA_UTC_OFFSET = "-05:00";

export interface MonthRange {
  start: string;
  end: string;
  label: string;
  slug: string;
}

// Rango [start, end) del mes anterior en hora Lima, como ISO UTC (end exclusivo).
export function previousMonthRange(now: Date = new Date()): MonthRange {
  // Componentes de la fecha actual EN hora Lima (no en la del servidor).
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: LIMA_TZ,
    year: "numeric",
    month: "2-digit",
  }).formatToParts(now);
  const year = Number(parts.find((p) => p.type === "year")?.value);
  const month = Number(parts.find((p) => p.type === "month")?.value); // 1-12

  // Mes anterior (con salto de año en enero).
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;

  const pad = (n: number) => String(n).padStart(2, "0");
  // Medianoche hora Lima expresada como instante UTC (-05:00 fijo).
  const start = new Date(`${prevYear}-${pad(prevMonth)}-01T00:00:00${LIMA_UTC_OFFSET}`).toISOString();
  const end = new Date(`${year}-${pad(month)}-01T00:00:00${LIMA_UTC_OFFSET}`).toISOString();

  const label = new Intl.DateTimeFormat("es-PE", {
    timeZone: LIMA_TZ,
    month: "long",
    year: "numeric",
  }).format(new Date(start));

  return { start, end, label, slug: `${prevYear}-${pad(prevMonth)}` };
}

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
