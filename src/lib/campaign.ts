// Metas y parámetros de la barra de recaudación ("Cada sol cuenta").
// Fuente única: tocar solo este archivo para ajustar metas, cache o derivación.
// V2: metaRecaudada / metaNinos migran a Sanity (editables por el equipo).

// Meta de recaudación en soles y de niños abrigados.
export const CAMPAIGN_GOAL_RAISED = 165_000;
export const CAMPAIGN_GOAL_KIDS = 5_000;

// Clave en Redis del total recaudado "caliente" (cache de la suma de Supabase).
export const CAMPAIGN_RAISED_KEY = "campaign:raised";

// Segundos que vive el cache del total. Bajo = casi en vivo, pero protege contra
// picos de tráfico (un bot no dispara una query por hit). Subir tras migrar a GCP.
export const CAMPAIGN_CACHE_TTL = 30;

// Niños abrigados derivados del avance de recaudación, proporcional a la meta.
// Evita una columna extra por donación; el monto libre no mapea a niños exactos.
export function kidsFromRaised(raised: number): number {
  if (CAMPAIGN_GOAL_RAISED <= 0) return 0;
  return Math.round((raised / CAMPAIGN_GOAL_RAISED) * CAMPAIGN_GOAL_KIDS);
}
