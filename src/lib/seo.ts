import { dictionaries, type Language } from "@/i18n/dictionaries";
import { defaultLang } from "@/i18n/config";

export const SITE_NAME = "Sonqo Perú";
export const LEGAL_NAME = "Sonqo Perú Solidario";
export const DEFAULT_OG_IMAGE = "/og-image.jpg";

/** Perfiles oficiales. Alimentan `sameAs` del schema (señal de marca a Google). */
export const SOCIAL_LINKS = [
  "https://www.instagram.com/sonqoperusolidario/",
  "https://www.facebook.com/sonqoperusolidario/",
  "https://www.linkedin.com/company/sonqo-peru-solidario/",
] as const;

/** Contacto público (schema contactPoint). */
export const CONTACT_EMAIL = "sonqoperusolidario@gmail.com";

/** Mapea el locale interno al formato IETF que espera og:locale y hreflang. */
export const OG_LOCALE: Record<Language, string> = {
  es: "es_PE",
  en: "en_US",
};

/** hreflang usa guion (es-PE); Open Graph usa guion bajo (es_PE). */
export const HREFLANG: Record<Language, string> = {
  es: "es-PE",
  en: "en-US",
};

/**
 * Dada la URL actual, devuelve la ruta base sin prefijo de idioma.
 * "/en/donate" → "/donate" · "/en" → "/" · "/donate" → "/donate".
 * Es la pieza que permite generar los alternates hreflang de cada página.
 */
export function stripLocale(pathname: string): string {
  const withoutEn = pathname.replace(/^\/en(?=\/|$)/, "");
  return withoutEn === "" ? "/" : withoutEn;
}

/** Construye la ruta localizada a partir de la ruta base (inverso de stripLocale). */
export function localizedPath(basePath: string, lang: Language): string {
  if (lang === defaultLang) return basePath;
  return basePath === "/" ? "/en" : `/en${basePath}`;
}

/**
 * Alternates hreflang absolutos para la página actual. Incluye x-default
 * (apunta al español, el idioma por defecto del sitio).
 */
export function buildAlternates(site: URL | undefined, pathname: string) {
  const base = stripLocale(pathname);
  const abs = (path: string) => new URL(path, site).href;
  return {
    es: abs(localizedPath(base, "es")),
    en: abs(localizedPath(base, "en")),
    xDefault: abs(localizedPath(base, "es")),
  };
}

/**
 * JSON-LD de la organización (schema NGO). Es lo que le dice a Google, de forma
 * legible por máquina, que somos una ONG peruana — clave para aparecer en
 * búsquedas de "ONG" y habilitar el knowledge panel de marca.
 */
export function organizationSchema(site: URL | undefined) {
  const abs = (path: string) => new URL(path, site).href;
  return {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: SITE_NAME,
    legalName: LEGAL_NAME,
    alternateName: "Sonqo",
    url: site?.href,
    logo: abs("/logo-sonqo.svg"),
    image: abs(DEFAULT_OG_IMAGE),
    slogan: "Desde el corazón del Perú",
    description:
      "ONG peruana sin fines de lucro fundada en 2016. Confeccionamos y entregamos casacas térmicas a niños del friaje en las comunidades altoandinas de todo el Perú. Todo el equipo trabaja ad honorem.",
    foundingDate: "2016",
    foundingLocation: { "@type": "Place", name: "Perú" },
    email: CONTACT_EMAIL,
    areaServed: { "@type": "Country", name: "Perú" },
    knowsAbout: [
      "Friaje",
      "Donación de abrigo",
      "Casacas térmicas",
      "Niños en situación de pobreza",
      "Comunidades altoandinas del Perú",
    ],
    knowsLanguage: ["es", "en"],
    contactPoint: {
      "@type": "ContactPoint",
      email: CONTACT_EMAIL,
      contactType: "customer support",
      availableLanguage: ["Spanish", "English"],
    },
    sameAs: [...SOCIAL_LINKS],
  };
}

export function faqSchema(lang: Language) {
  const faq = dictionaries[lang].faq as Record<string, string>;
  const pairs = [1, 2, 3, 4, 5, 6].map((i) => ({
    q: faq[`q${i}`],
    a: faq[`a${i}`],
  }));
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pairs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

export function websiteSchema(site: URL | undefined) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: site?.href,
    inLanguage: ["es-PE", "en-US"],
  };
}
