import es from "./es";
import en from "./en";

/**
 * es = fuente de verdad de la forma (namespaces + keys).
 * Si falta un namespace o una key en en → error en build (no en runtime).
 */
type Mirror<T> = { [N in keyof T]: { [K in keyof T[N]]: string } };

// Si en/ no cumple la forma de es/ → TypeScript marca error AQUÍ.
const _enParity: Mirror<typeof es> = en;
void _enParity;

export const dictionaries = { es, en } as const;

export type Language = keyof typeof dictionaries;
export type Namespace = keyof typeof es;
