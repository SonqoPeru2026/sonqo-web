import { createImageUrlBuilder } from "@sanity/image-url";
import { getImage } from "astro:assets";
import type { ImageMetadata } from "astro";
import { PUBLIC_SANITY_PROJECT_ID, SANITY_DATASET } from "astro:env/client";

// Imagen lista para renderizar: los componentes pintan <img> con estos atributos
// sin saber si la foto vino de Sanity o de src/assets (misma interfaz para ambas).
export interface ResolvedImage {
  src: string;
  srcset: string;
  width: number;
  height: number;
}

// Forma que proyectan las queries GROQ (ver lib/sanity.ts): id del asset +
// dimensiones originales, suficiente para construir URLs del CDN.
export interface SanityImageSource {
  id: string;
  width: number;
  height: number;
}

const builder = createImageUrlBuilder({
  projectId: PUBLIC_SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
});

// Mismos anchos que validamos en el fix de Lighthouse: pasos intermedios para
// que el navegador nunca descargue más píxeles de los que muestra.
const DEFAULT_WIDTHS = [640, 960, 1280, 1920, 2560];
const DEFAULT_QUALITY = 82;

/**
 * Imagen del CDN de Sanity con srcset responsive. Va directo a cdn.sanity.io
 * (transforms gratis, webp/avif automático); NO pasa por /_vercel/image para
 * no gastar la cuota de Image Optimization de Vercel.
 */
export function sanityImage(
  source: SanityImageSource,
  { widths = DEFAULT_WIDTHS, quality = DEFAULT_QUALITY }: { widths?: number[]; quality?: number } = {},
): ResolvedImage {
  const url = (w: number) =>
    builder.image(source.id).width(w).quality(quality).auto("format").url();

  // Nunca pedir más ancho que el original (Sanity no escala hacia arriba).
  const steps = widths.filter((w) => w < source.width);
  if (steps.length === 0) steps.push(source.width);

  return {
    src: url(steps[steps.length - 1]),
    srcset: steps.map((w) => `${url(w)} ${w}w`).join(", "),
    width: source.width,
    height: source.height,
  };
}

/** Imagen local (src/assets) con la misma interfaz, vía el pipeline de Astro. */
export async function localImage(
  meta: ImageMetadata,
  { widths = DEFAULT_WIDTHS, quality = DEFAULT_QUALITY }: { widths?: number[]; quality?: number } = {},
): Promise<ResolvedImage> {
  const img = await getImage({
    src: meta,
    widths: [...widths.filter((w) => w < meta.width), meta.width],
    quality,
  });
  return {
    src: img.src,
    srcset: img.srcSet.attribute,
    width: meta.width,
    height: meta.height,
  };
}
