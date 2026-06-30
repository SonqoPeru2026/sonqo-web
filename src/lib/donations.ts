import { getSupabaseAdmin } from "@/lib/supabase";

export interface DonationRecord {
  paymentId: string;
  amount: number;
  currency: string;
  status: string;
  payerEmail: string | null;
  paymentMethod: string | null;
  approvedAt: string | null;
}

/**
 * Registra una donación en Supabase. Idempotente por `payment_id` (upsert):
 * si MercadoPago reintenta la notificación, no se duplica la fila.
 * Devuelve true si quedó registrada; false si no se pudo (degrada sin lanzar,
 * para no romper la respuesta 200 que MercadoPago espera del webhook).
 */
export async function recordDonation(donation: DonationRecord): Promise<boolean> {
  const db = getSupabaseAdmin();
  if (!db) {
    console.warn("[donations] SUPABASE_SERVICE_KEY ausente, donación no registrada");
    return false;
  }

  const { error } = await db.from("donations").upsert(
    {
      payment_id: donation.paymentId,
      amount: donation.amount,
      currency: donation.currency,
      status: donation.status,
      payer_email: donation.payerEmail,
      payment_method: donation.paymentMethod,
      approved_at: donation.approvedAt,
    },
    { onConflict: "payment_id" },
  );

  if (error) {
    console.error("[donations] error registrando donación:", error);
    return false;
  }
  return true;
}

/**
 * Total recaudado real: SUM(amount) de las donaciones aprobadas (fuente de verdad).
 * Usa la función SQL `campaign_raised` (suma en la BD, devuelve un número, sin traer filas).
 * Devuelve null si no hay BD disponible o falla, para que el caller degrade sin romper.
 */
export async function sumApprovedDonations(): Promise<number | null> {
  const db = getSupabaseAdmin();
  if (!db) {
    console.warn("[donations] SUPABASE_SERVICE_KEY ausente, no se puede sumar la recaudación");
    return null;
  }

  const { data, error } = await db.rpc("campaign_raised");
  if (error) {
    console.error("[donations] error sumando la recaudación:", error);
    return null;
  }
  return Number(data) || 0;
}
