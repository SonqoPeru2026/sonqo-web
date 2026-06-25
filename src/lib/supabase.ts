import { createClient } from "@supabase/supabase-js";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "astro:env/client";

// Cliente anon usado desde el server para insertar leads.
// La seguridad real la da RLS en Supabase: anon solo puede INSERT en `leads`, nunca SELECT.
export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});
