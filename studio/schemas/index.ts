import siteSettings from "./siteSettings";
import heroSlide from "./heroSlide";
import galleryPhoto from "./galleryPhoto";
import donationPackage from "./donationPackage";
import { localeString, localeText } from "./localeString";

export const schemaTypes = [
  // Tipos compartidos
  localeString,
  localeText,
  // Documentos
  siteSettings,
  heroSlide,
  galleryPhoto,
  donationPackage,
];
