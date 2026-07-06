import { getImage } from "astro:assets";
import type { ImageMetadata } from "astro";
import type { GalleryItem } from "@/data/gallery";
import type { GalleryPhotoDoc } from "@/lib/sanity";
import { sanityImage } from "@/lib/sanity-image";
import type { ResolvedImage } from "@/lib/sanity-image";

export type GalleryCategory = "photos" | "reels" | "videos";

// Categoría de filtro por tipo de item.
export const CATEGORY: Record<GalleryItem["type"], GalleryCategory> = {
  photo: "photos",
  album: "photos",
  reel: "reels",
  igpost: "reels",
  video: "videos",
};

export type PhotoSize = "wide" | "tall" | "big";

// Card de foto del mosaico, ya resuelta (misma forma venga de Sanity o local).
export interface PhotoCard {
  thumb: ResolvedImage;
  full: string; // URL grande para el lightbox
  caption?: string;
  location?: string;
  size?: PhotoSize;
  albumFulls: string[]; // vacío = foto suelta; con items = álbum
}

export interface LightboxSlide {
  src: string;
  alt: string;
  caption?: string;
  location?: string;
}

export interface LightboxData {
  groups: Record<string, LightboxSlide[]>;
  indexByPhoto: Map<number, { group: string; index: number }>;
}

type GlobModules = Record<string, { default: ImageMetadata }>;

/** Resuelve fotos por nombre (sin extensión) desde un import.meta.glob eager. */
export function createPhotoResolver(modules: GlobModules) {
  const byName = new Map<string, ImageMetadata>(
    Object.entries(modules).map(([path, mod]) => [
      path.split("/").pop()!.replace(/\.\w+$/, ""),
      mod.default,
    ]),
  );
  return (name: string): ImageMetadata => {
    const meta = byName.get(name);
    if (!meta) throw new Error(`Gallery photo not found: ${name}`);
    return meta;
  };
}

// Anchos de miniatura según el espacio que ocupa la card en el mosaico
// (calzan con el atributo `sizes` que pinta GalleryPage).
const THUMB_WIDTHS = { big: [620, 1200], normal: [300, 480, 720] } as const;
const THUMB_QUALITY = 72;
const FULL_WIDTH = 1600;
const FULL_QUALITY = 78;

const isBigSize = (size?: PhotoSize) => size === "wide" || size === "big";

/** Cards desde documentos de Sanity (URLs del CDN de Sanity, sin /_vercel/image). */
export function photosFromSanity(docs: GalleryPhotoDoc[]): PhotoCard[] {
  return docs.flatMap((d) => {
    if (!d.imagen) return [];
    const size = d.size && d.size !== "normal" ? d.size : undefined;
    const widths = isBigSize(size) ? [...THUMB_WIDTHS.big] : [...THUMB_WIDTHS.normal];
    const full = (img: NonNullable<GalleryPhotoDoc["imagen"]>) =>
      sanityImage(img, { widths: [FULL_WIDTH], quality: FULL_QUALITY }).src;
    return [
      {
        thumb: sanityImage(d.imagen, { widths, quality: THUMB_QUALITY }),
        full: full(d.imagen),
        caption: d.caption ?? undefined,
        location: d.location ?? undefined,
        size,
        albumFulls: (d.fotosAlbum ?? []).map(full),
      },
    ];
  });
}

/** Cards desde las fotos locales de src/assets (fallback, pipeline de Astro). */
export async function photosFromLocal(
  items: readonly GalleryItem[],
  photoMeta: (name: string) => ImageMetadata,
): Promise<PhotoCard[]> {
  const thumb = async (name: string, size?: PhotoSize): Promise<ResolvedImage> => {
    const meta = photoMeta(name);
    const widths = isBigSize(size) ? [...THUMB_WIDTHS.big] : [...THUMB_WIDTHS.normal];
    const img = await getImage({ src: meta, widths, quality: THUMB_QUALITY });
    return { src: img.src, srcset: img.srcSet.attribute, width: meta.width, height: meta.height };
  };
  const full = async (name: string) =>
    (await getImage({ src: photoMeta(name), width: FULL_WIDTH, quality: FULL_QUALITY, format: "webp" }))
      .src;

  const cards: PhotoCard[] = [];
  for (const item of items) {
    if (item.type === "photo") {
      cards.push({
        thumb: await thumb(item.src, item.size),
        full: await full(item.src),
        caption: item.caption,
        location: item.location,
        size: item.size,
        albumFulls: [],
      });
    } else if (item.type === "album") {
      cards.push({
        thumb: await thumb(item.cover),
        full: await full(item.cover),
        caption: item.caption,
        location: item.location,
        albumFulls: await Promise.all(item.photos.map(full)),
      });
    }
  }
  return cards;
}

/**
 * Grupos del lightbox: "main" = fotos sueltas en orden; cada álbum navega solo
 * sus propias fotos. El índice del map es la posición de la card en `photos`.
 */
export function buildLightbox(photos: PhotoCard[], fallbackAlt: string): LightboxData {
  const groups: Record<string, LightboxSlide[]> = { main: [] };
  const indexByPhoto = new Map<number, { group: string; index: number }>();

  for (const [i, photo] of photos.entries()) {
    const base = {
      alt: photo.caption ?? fallbackAlt,
      caption: photo.caption,
      location: photo.location,
    };
    if (photo.albumFulls.length === 0) {
      indexByPhoto.set(i, { group: "main", index: groups.main.length });
      groups.main.push({ src: photo.full, ...base });
    } else {
      const group = `album-${i}`;
      indexByPhoto.set(i, { group, index: 0 });
      groups[group] = photo.albumFulls.map((src) => ({ src, ...base }));
    }
  }
  return { groups, indexByPhoto };
}
