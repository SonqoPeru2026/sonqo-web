import es from "./es";
import en from "./en";

/**
 * es = fuente de verdad de la forma (namespaces + keys).
 * Si falta un namespace o una key en en → error en build (no en runtime).
 *
 * DeepMirror recorre la forma recursivamente: strings → string, arrays → array
 * del mismo shape, objetos → mismas keys. Así un namespace puede tener contenido
 * estructurado (p.ej. `sections: [{ heading, paragraphs, list }]`) y en/ debe
 * replicar exactamente esa forma, no solo keys planas de string.
 */
type DeepMirror<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly DeepMirror<U>[]
    : { [K in keyof T]: DeepMirror<T[K]> };

// Si en/ no cumple la forma de es/ → TypeScript marca error AQUÍ.
const _enParity: DeepMirror<typeof es> = en;
void _enParity;

export const dictionaries = { es, en } as const;

export type Language = keyof typeof dictionaries;
export type Namespace = keyof typeof es;
