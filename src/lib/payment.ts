// Fuente única de los estados de pago (valores de MercadoPago).
export const PAYMENT_STATUS = {
  approved: "approved",
  pending: "pending",
  inProcess: "in_process",
  rejected: "rejected",
  cancelled: "cancelled",
  refunded: "refunded",
  unknown: "unknown",
} as const;

export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

// True solo si el pago está aprobado. Único lugar que compara contra "approved".
export function isApproved(status?: string | null): boolean {
  return status === PAYMENT_STATUS.approved;
}
