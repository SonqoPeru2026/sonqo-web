import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "astro:env/client";
import { SUPABASE_SERVICE_KEY } from "astro:env/server";

// Cliente anon usado desde el server para insertar leads.
// La seguridad real la da RLS en Supabase: anon solo puede INSERT en `leads`, nunca SELECT.
export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

let admin: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient | null {
  if (!SUPABASE_SERVICE_KEY) return null;
  if (!admin) {
    admin = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return admin;
}
