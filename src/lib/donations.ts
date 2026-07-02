import { getSupabaseAdmin } from "@/lib/supabase";

export interface DonationRecord {
  paymentId: string;
  amount: number;
  currency: string;
  status: string;
  payerEmail: string | null;
  paymentMethod: string | null;
  approvedAt: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  packageId: string | null;
  consentAccepted: boolean;
  consentAt: string | null;
  consentIp: string | null;
}

/**
 * Registro inicial de un intento de pago, al momento de crearlo en MercadoPago
 * (antes de saber si se aprueba). Único punto que escribe el contacto del
 * donante — el webhook (`updateDonationStatus`) solo actualiza el status.
 * Idempotente por `payment_id` (upsert). Devuelve true si quedó registrada;
 * false si no se pudo (degrada sin lanzar: el pago ya se creó en MP, esto no
 * debe bloquear la respuesta al cliente).
 */
export async function insertDonation(donation: DonationRecord): Promise<boolean> {
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
      first_name: donation.firstName,
      last_name: donation.lastName,
      phone: donation.phone,
      package_id: donation.packageId,
      consent_accepted: donation.consentAccepted,
      consent_at: donation.consentAt,
      consent_ip: donation.consentIp,
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
 * Actualiza solo el status (y approved_at) de una donación ya registrada.
 * Llamado desde el webhook: nunca toca contacto, para no pisarlo con null
 * si la notificación llega sin esos datos.
 */
export async function updateDonationStatus(
  paymentId: string,
  status: string,
  approvedAt: string | null,
): Promise<boolean> {
  const db = getSupabaseAdmin();
  if (!db) {
    console.warn("[donations] SUPABASE_SERVICE_KEY ausente, status no actualizado");
    return false;
  }

  const { error } = await db
    .from("donations")
    .update({ status, approved_at: approvedAt })
    .eq("payment_id", paymentId);

  if (error) {
    console.error("[donations] error actualizando status:", error);
    return false;
  }
  return true;
}

/**
 * Datos de una donación necesarios para el email de agradecimiento.
 */
export interface DonationContact {
  payerEmail: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  packageId: string | null;
  consentAccepted: boolean;
  consentAt: string | null;
  consentIp: string | null;
}

export async function getDonationContact(paymentId: string): Promise<DonationContact | null> {
  const db = getSupabaseAdmin();
  if (!db) return null;

  const { data, error } = await db
    .from("donations")
    .select("payer_email, first_name, last_name, phone, package_id, consent_accepted, consent_at, consent_ip")
    .eq("payment_id", paymentId)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("[donations] error leyendo contacto:", error);
    return null;
  }
  return {
    payerEmail: data.payer_email,
    firstName: data.first_name,
    lastName: data.last_name,
    phone: data.phone,
    packageId: data.package_id,
    consentAccepted: data.consent_accepted ?? false,
    consentAt: data.consent_at,
    consentIp: data.consent_ip,
  };
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
