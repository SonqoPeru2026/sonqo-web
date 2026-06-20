import { defaultLang } from "./config";
import { dictionaries, type Language, type Namespace } from "./dictionaries";

/** Saca el idioma del pathname. */
export function getLang(url: URL): Language {
  const [, seg] = url.pathname.split("/");
  return seg === "en" ? "en" : (defaultLang as Language);
}

/**
 * Construye una ruta con el prefijo de idioma correcto.
 * es (default) → sin prefijo: "/donate". en → "/en/donate".
 */
export function localizePath(path: string, lang: Language): string {
  if (lang === defaultLang) return path;
  return path === "/" ? `/${lang}` : `/${lang}${path}`;
}

/**
 * Autocompletado + error si la key no existe.
 */
export function useTranslations<N extends Namespace>(lang: Language, ns: N) {
  return dictionaries[lang][ns];
}
