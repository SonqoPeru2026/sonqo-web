// Parámetros de la barra de recaudación ("Cada sol cuenta").
// Las metas (goal) las edita el equipo en Sanity; estos valores son el fallback
// cuando Sanity no responde (ver lib/sanity.ts → FALLBACK).

// Metas por defecto: recaudación en soles y niños abrigados.
export const CAMPAIGN_GOAL_RAISED = 165_000;
export const CAMPAIGN_GOAL_KIDS = 5_000;

// Clave en Redis del total recaudado "caliente" (cache de la suma de Supabase).
export const CAMPAIGN_RAISED_KEY = "campaign:raised";

// Segundos que vive el cache del total. Bajo = casi en vivo, pero protege contra
// picos de tráfico (un bot no dispara una query por hit). Subir tras migrar a GCP.
export const CAMPAIGN_CACHE_TTL = 30;
