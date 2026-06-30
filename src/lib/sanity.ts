import { createClient } from "@sanity/client";
import { PUBLIC_SANITY_PROJECT_ID, SANITY_DATASET } from "astro:env/client";
import { CAMPAIGN_GOAL_RAISED, CAMPAIGN_GOAL_KIDS } from "@/lib/campaign";

// Cliente de solo lectura. `useCdn: true` sirve el contenido publicado desde el
// CDN de Sanity (cacheado, gratis en free tier). Dataset público → sin token.
const client = createClient({
  projectId: PUBLIC_SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: true,
});

// Configuración del sitio editable por el equipo (singleton en Sanity).
export interface SiteSettings {
  ninosAtendidos: number; // Motivation "Niños abrigados" (+ Hero en V2)
  comunidades: number; // Motivation "Comunidades alcanzadas"
  solesRecaudados: number; // Motivation "Soles recaudados" (acumulado manual)
  metaRecaudada: number; // CampaignProgress: meta barra recaudación
  metaNinos: number; // CampaignProgress: meta barra niños
}

// Valores por defecto = los actuales hardcodeados. Si Sanity falla o un campo
// viene vacío, el sitio usa estos y no se rompe (degrada con gracia).
const FALLBACK: SiteSettings = {
  ninosAtendidos: 31_877,
  comunidades: 27,
  solesRecaudados: 765_260,
  metaRecaudada: CAMPAIGN_GOAL_RAISED,
  metaNinos: CAMPAIGN_GOAL_KIDS,
};

/**
 * Lee el singleton `siteSettings`. Se llama en build (páginas prerender), no por
 * visita: cero costo en tráfico. Devuelve siempre un objeto completo: cada campo
 * vacío o nulo cae al FALLBACK, así los componentes nunca reciben null/undefined.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const data = await client.fetch<Partial<SiteSettings> | null>(
      `*[_type == "siteSettings"][0]{ ninosAtendidos, comunidades, solesRecaudados, metaRecaudada, metaNinos }`,
    );
    // Solo mezclamos valores presentes: un campo null en Sanity no pisa el default.
    const present = Object.fromEntries(
      Object.entries(data ?? {}).filter(([, value]) => value != null),
    );
    return { ...FALLBACK, ...present };
  } catch (err) {
    console.warn("[sanity] no se pudo leer siteSettings, uso defaults:", err);
    return FALLBACK;
  }
}
