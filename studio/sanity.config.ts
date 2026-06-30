import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";

// projectId y dataset desde variables de entorno (Vite las expone con el prefijo
// SANITY_STUDIO_). Ver .env.example. Así se cambia de dataset sin tocar código.
const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET;

if (!projectId || !dataset) {
  throw new Error(
    "Faltan SANITY_STUDIO_PROJECT_ID y/o SANITY_STUDIO_DATASET. Copia .env.example a .env.",
  );
}

// El singleton vive con un id fijo: así el sitio lo lee sin ambigüedad y el
// equipo nunca crea documentos duplicados.
const SITE_SETTINGS_ID = "siteSettings";

export default defineConfig({
  name: "default",
  title: "Sonqo Perú",
  projectId,
  dataset,

  plugins: [
    structureTool({
      // Estructura a medida: una sola entrada que abre el documento único.
      structure: (S) =>
        S.list()
          .title("Contenido")
          .items([
            S.listItem()
              .title("Configuración del sitio")
              .id(SITE_SETTINGS_ID)
              .child(
                S.document().schemaType("siteSettings").documentId(SITE_SETTINGS_ID),
              ),
          ]),
    }),
    visionTool(),
  ],

  schema: { types: schemaTypes },
});
