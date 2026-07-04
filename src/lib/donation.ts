export const PACKAGES = {
  aliado: { price: 33 },
  ninos: { price: 165 },
  corazon: { price: 330 },
  comunidad: { price: 660 },
} as const;

export type PackageId = keyof typeof PACKAGES;

// Rango permitido para donación de monto libre.
export const MIN_DONATION = 10;
export const MAX_DONATION = 50_000;

// Moneda de todas las donaciones (soles peruanos).
export const DEFAULT_CURRENCY = "PEN";

// Formato de monto en soles para texto (emails, subjects, logs): "S/ 1234.56".
export function formatSoles(amount: number): string {
  return `S/ ${amount.toFixed(2)}`;
}

export function isPackageId(id: unknown): id is PackageId {
  return typeof id === "string" && id in PACKAGES;
}

export function packagePrice(id: PackageId): number {
  return PACKAGES[id].price;
}

// Nombres legibles en español (emails transaccionales son solo-español, igual que
// los demás templates en components/emails/).
const PACKAGE_NAMES: Record<PackageId, string> = {
  aliado: "Aliado Sonqo",
  ninos: "Niños Felices",
  corazon: "Corazón Solidario",
  comunidad: "Comunidad Sonqo",
};

export function packageName(id: string | null | undefined): string {
  return isPackageId(id) ? PACKAGE_NAMES[id] : "Donación personalizada";
}

// Monto autoritativo en soles desde un paquete o un monto libre. null si es inválido.
// El server SIEMPRE usa esto; nunca el monto que envía el cliente.
export function resolveAmount(input: {
  packageId?: string | null;
  amount?: number | null;
}): number | null {
  if (isPackageId(input.packageId)) return PACKAGES[input.packageId].price;

  if (typeof input.amount === "number" && Number.isFinite(input.amount)) {
    const rounded = Math.round(input.amount);
    if (rounded >= MIN_DONATION && rounded <= MAX_DONATION) return rounded;
  }
  return null;
}
