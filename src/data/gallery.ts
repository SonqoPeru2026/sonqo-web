// Contenido del mosaico de /gallery. Fuente única: agregar/quitar/reordenar
// items aquí (V2 → migrar a Sanity). El orden del array es el orden visual.
//
// Tipos soportados:
//   photo  → foto local (src = nombre del archivo en assets/images/gallery, sin .webp)
//   album  → grupo de fotos locales; la card muestra la portada y abre el
//            lightbox navegando solo las fotos del álbum
//   reel   → reel/video de Instagram (card 9:16, carga el embed al hacer click)
//   igpost → publicación de Instagram cuadrada (mismo facade, card 1×1)
//   video  → video de YouTube (miniatura + play, carga el iframe al click)
//
// El shortcode de IG es el tramo tras /p/ o /reel/ en la URL.
// `size` controla el espacio en el mosaico: wide (2×1), tall (1×2), big (2×2).
// `caption` y `location` son opcionales: si existen, aparecen en el hover y
// en el lightbox.

interface GalleryItemBase {
  caption?: string;
  location?: string;
}

export type GalleryItem =
  | (GalleryItemBase & {
      type: "photo";
      src: string;
      size?: "wide" | "tall" | "big";
    })
  | (GalleryItemBase & { type: "album"; cover: string; photos: string[] })
  | (GalleryItemBase & { type: "reel"; code: string })
  | (GalleryItemBase & { type: "igpost"; code: string })
  | (GalleryItemBase & { type: "video"; youtubeId: string });

export const GALLERY_ITEMS: GalleryItem[] = [
  { type: "photo", src: "1", size: "big" },
  { type: "reel", code: "C9gcBzJtgsn" },
  { type: "photo", src: "2" },
  { type: "photo", src: "3" },
  { type: "reel", code: "C8vKCP9BVGJ" },
  { type: "photo", src: "4", size: "wide" },
  { type: "photo", src: "5" },
  { type: "reel", code: "CvFixrirBZT" },
  { type: "photo", src: "6", size: "tall" },
  { type: "reel", code: "C7mvIEeso2F" },
  { type: "photo", src: "7", size: "wide" },
  { type: "photo", src: "8" },
  { type: "reel", code: "C7ZwTH2Kd0P" },
  { type: "reel", code: "C7Cay3RL7FG" },
  { type: "photo", src: "9" },
  { type: "photo", src: "10" },
  { type: "reel", code: "CvNmadNJFbT" },
  { type: "reel", code: "CumsDlPtz5l" },
  { type: "photo", src: "11", size: "big" },
];
