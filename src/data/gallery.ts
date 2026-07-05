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
  {
    type: "photo",
    src: "1",
    size: "big",
    caption: "El día que llega el abrigo",
    location: "Comunidades altoandinas del Perú",
  },
  { type: "reel", code: "C9gcBzJtgsn" },
  { type: "photo", src: "2" },
  { type: "photo", src: "3" },
  { type: "reel", code: "C8vKCP9BVGJ" },
  {
    type: "photo",
    src: "4",
    size: "wide",
    caption: "Cada mano arriba, una casaca entregada",
    location: "A más de 4,000 msnm",
  },
  { type: "photo", src: "5" },
  { type: "reel", code: "CvFixrirBZT" },
  {
    type: "photo",
    src: "6",
    size: "tall",
    caption: "Los más pequeños son los que más frío pasan",
    location: "Andes del Perú",
  },
  { type: "reel", code: "C7mvIEeso2F" },
  {
    type: "photo",
    src: "7",
    size: "wide",
    caption: "Sus primeros pasos, ahora con abrigo",
    location: "Acraquia, Huancavelica",
  },
  { type: "photo", src: "8" },
  { type: "reel", code: "C7ZwTH2Kd0P" },
  { type: "reel", code: "C7Cay3RL7FG" },
  { type: "photo", src: "9" },
  { type: "photo", src: "10" },
  { type: "reel", code: "CvNmadNJFbT" },
  { type: "reel", code: "CumsDlPtz5l" },
  {
    type: "photo",
    src: "11",
    size: "big",
    caption: "Sonrisas que abrigan de vuelta",
    location: "Andes del Perú",
  },
];
