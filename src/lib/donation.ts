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

export function isPackageId(id: unknown): id is PackageId {
  return typeof id === "string" && id in PACKAGES;
}

export function packagePrice(id: PackageId): number {
  return PACKAGES[id].price;
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
