import hero from "./hero";
import navbar from "./navbar";
import footer from "./footer";
import meta from "./meta";
import purpose from "./purpose";
import motivation from "./motivation";
import aboutus from "./aboutus";
import process from "./process";
import campaign from "./campaign";
import packageCard from "./packageCard";
import customAmount from "./customAmount";
import bankTransfers from "./bankTransfers";
import faq from "./faq";

// Sección nueva → 1 import + 1 línea aquí (y su gemelo en en/index.ts).
export default {
  hero,
  navbar,
  footer,
  meta,
  purpose,
  motivation,
  aboutus,
  process,
  campaign,
  packageCard,
  customAmount,
  bankTransfers,
  faq,
} as const;
