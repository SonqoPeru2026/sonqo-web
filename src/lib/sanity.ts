import { createClient } from "@sanity/client";
import { PUBLIC_SANITY_PROJECT_ID, SANITY_DATASET } from "astro:env/client";
import { CAMPAIGN_GOAL_RAISED, CAMPAIGN_GOAL_KIDS } from "@/lib/campaign";
import { sanityImage, localImage } from "@/lib/sanity-image";
import type { ResolvedImage, SanityImageSource } from "@/lib/sanity-image";
import { useTranslations } from "@/i18n/utils";
import type { Language } from "@/i18n/dictionaries";
import type { PackageId } from "@/lib/donation";

import slide1 from "@/assets/images/hero-slide-1.webp";
import slide2 from "@/assets/images/hero-slide-2.webp";
import slide2Mobile from "@/assets/images/hero-slide-2-mobile.webp";
import slide3 from "@/assets/images/hero-slide-3.webp";
import slide3Mobile from "@/assets/images/hero-slide-3-mobile.webp";
import donateHeroImg from "@/assets/images/donate-hero.webp";

// Cliente de solo lectura. `useCdn: true` sirve el contenido publicado desde el
// CDN de Sanity (cacheado, gratis en free tier). Dataset público → sin token.
const client = createClient({
  projectId: PUBLIC_SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: true,
});

const IMG = `asset->{ "id": _id, "width": metadata.dimensions.width, "height": metadata.dimensions.height }`;

export interface SiteSettings {
  ninosAtendidos: number; // Motivation "Niños abrigados" + Hero
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

export interface HeroSlideContent {
  titulo: string;
  texto: string;
  alt: string;
  img: ResolvedImage;
  imgMobile: ResolvedImage | null;
}

interface HeroSlideDoc {
  titulo: string | null;
  texto: string | null;
  alt: string | null;
  imagen: SanityImageSource | null;
  imagenMobile: SanityImageSource | null;
}

async function fallbackHeroSlides(lang: Language): Promise<HeroSlideContent[]> {
  const t = useTranslations(lang, "hero");
  const raw = [
    { img: slide1, imgMobile: null, titulo: t.slide1Title, texto: t.slide1Text, alt: t.slide1Alt },
    { img: slide2, imgMobile: slide2Mobile, titulo: t.slide2Title, texto: t.slide2Text, alt: t.slide2Alt },
    { img: slide3, imgMobile: slide3Mobile, titulo: t.slide3Title, texto: t.slide3Text, alt: t.slide3Alt },
  ];
  return Promise.all(
    raw.map(async (s) => ({
      titulo: s.titulo,
      texto: s.texto,
      alt: s.alt,
      img: await localImage(s.img, { quality: 85 }),
      imgMobile: s.imgMobile ? await localImage(s.imgMobile, { quality: 85 }) : null,
    })),
  );
}

export async function getHeroSlides(lang: Language): Promise<HeroSlideContent[]> {
  try {
    const docs = await client.fetch<HeroSlideDoc[]>(
      `*[_type == "heroSlide"] | order(orden asc) {
        "titulo": titulo[$lang], "texto": texto[$lang], "alt": alt[$lang],
        "imagen": imagen.${IMG}, "imagenMobile": imagenMobile.${IMG}
      }`,
      { lang },
    );
    const valid = (docs ?? []).filter(
      (d): d is HeroSlideDoc & { imagen: SanityImageSource } =>
        d.imagen != null && !!d.titulo && !!d.texto,
    );
    if (valid.length === 0) return fallbackHeroSlides(lang);

    return valid.map((d) => ({
      titulo: d.titulo!,
      texto: d.texto!,
      alt: d.alt ?? "",
      img: sanityImage(d.imagen, { quality: 85 }),
      imgMobile: d.imagenMobile ? sanityImage(d.imagenMobile, { quality: 85 }) : null,
    }));
  } catch (err) {
    console.warn("[sanity] no se pudo leer heroSlide, uso slides del código:", err);
    return fallbackHeroSlides(lang);
  }
}

/** Imagen de portada de /donate: la de Sanity o la local si no hay publicada. */
export async function getDonateHeroImage(): Promise<ResolvedImage> {
  try {
    const img = await client.fetch<SanityImageSource | null>(
      `*[_type == "siteSettings"][0].imagenDonateHero.${IMG}`,
    );
    if (img) return sanityImage(img);
  } catch (err) {
    console.warn("[sanity] no se pudo leer imagenDonateHero, uso la local:", err);
  }
  return localImage(donateHeroImg);
}

export interface PackageContent {
  name: string;
  impact: string;
}

export async function getPackagesContent(
  lang: Language,
): Promise<Record<PackageId, PackageContent>> {
  const t = useTranslations(lang, "packageCard");
  const fallback: Record<PackageId, PackageContent> = {
    aliado: { name: t.aliadoName, impact: t.impact1 },
    ninos: { name: t.ninosName, impact: t.impact5 },
    corazon: { name: t.corazonName, impact: t.impact10 },
    comunidad: { name: t.comunidadName, impact: t.impact20 },
  };
  try {
    const docs = await client.fetch<
      { packageId: PackageId | null; name: string | null; impact: string | null }[]
    >(
      `*[_type == "donationPackage"]{ packageId, "name": nombre[$lang], "impact": impacto[$lang] }`,
      { lang },
    );
    for (const d of docs ?? []) {
      if (d.packageId && d.packageId in fallback && d.name && d.impact) {
        fallback[d.packageId] = { name: d.name, impact: d.impact };
      }
    }
  } catch (err) {
    console.warn("[sanity] no se pudo leer donationPackage, uso i18n:", err);
  }
  return fallback;
}

export interface GalleryPhotoDoc {
  imagen: SanityImageSource | null;
  size: "normal" | "wide" | "tall" | "big" | null;
  caption: string | null;
  location: string | null;
  fotosAlbum: SanityImageSource[] | null;
}

export async function getGalleryPhotos(lang: Language): Promise<GalleryPhotoDoc[] | null> {
  try {
    const docs = await client.fetch<GalleryPhotoDoc[]>(
      `*[_type == "galleryPhoto"] | order(orden asc) {
        "imagen": imagen.${IMG}, size, "caption": caption[$lang], location,
        "fotosAlbum": fotosAlbum[].${IMG}
      }`,
      { lang },
    );
    const valid = (docs ?? []).filter((d) => d.imagen != null);
    return valid.length > 0 ? valid : null;
  } catch (err) {
    console.warn("[sanity] no se pudo leer galleryPhoto, uso fotos locales:", err);
    return null;
  }
}
