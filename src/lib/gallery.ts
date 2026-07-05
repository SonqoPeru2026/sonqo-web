// Lógica de datos de la galería (server). La presentación vive en
// components/gallery/GalleryPage.astro; aquí solo transformación de datos.
import { getImage } from "astro:assets";
import type { ImageMetadata } from "astro";
import type { GalleryItem } from "@/data/gallery";

export type GalleryCategory = "photos" | "reels" | "videos";

// Categoría de filtro por tipo de item.
export const CATEGORY: Record<GalleryItem["type"], GalleryCategory> = {
  photo: "photos",
  album: "photos",
  reel: "reels",
  igpost: "reels",
  video: "videos",
};

export interface LightboxSlide {
  src: string;
  alt: string;
  caption?: string;
  location?: string;
}

export interface LightboxData {
  groups: Record<string, LightboxSlide[]>;
  indexByItem: Map<number, { group: string; index: number }>;
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

export function countByCategory(items: readonly GalleryItem[]) {
  const counts: Record<GalleryCategory, number> = { photos: 0, reels: 0, videos: 0 };
  for (const item of items) counts[CATEGORY[item.type]]++;
  return counts;
}

/**
 * Grupos del lightbox: "main" = fotos sueltas en orden; cada álbum navega solo
 * sus propias fotos. Genera URLs grandes con getImage (no las miniaturas del grid).
 */
export async function buildLightboxData(
  items: readonly GalleryItem[],
  photoMeta: (name: string) => ImageMetadata,
  fallbackAlt: string,
): Promise<LightboxData> {
  const fullSize = async (name: string) =>
    (await getImage({ src: photoMeta(name), width: 1600, quality: 78, format: "webp" })).src;

  const groups: Record<string, LightboxSlide[]> = { main: [] };
  const indexByItem = new Map<number, { group: string; index: number }>();

  for (const [i, item] of items.entries()) {
    if (item.type === "photo") {
      indexByItem.set(i, { group: "main", index: groups.main.length });
      groups.main.push({
        src: await fullSize(item.src),
        alt: item.caption ?? fallbackAlt,
        caption: item.caption,
        location: item.location,
      });
    } else if (item.type === "album") {
      const group = `album-${i}`;
      indexByItem.set(i, { group, index: 0 });
      groups[group] = await Promise.all(
        item.photos.map(async (name) => ({
          src: await fullSize(name),
          alt: item.caption ?? fallbackAlt,
          caption: item.caption,
          location: item.location,
        })),
      );
    }
  }
  return { groups, indexByItem };
}
