// Publicaciones de Instagram embebidas en /gallery.
// Fuente única: agregar/quitar shortcodes aquí (V2 → migrar a Sanity).
// El shortcode es el tramo tras /p/ o /reel/ en la URL:
//   https://www.instagram.com/p/C9gcBzJtgsn/  →  "C9gcBzJtgsn"
// El componente arma el embed con https://www.instagram.com/p/<code>/embed

export const INSTAGRAM_HANDLE = "sonqoperusolidario";

export const INSTAGRAM_POSTS = [
  "C9gcBzJtgsn",
  "C8vKCP9BVGJ",
  "CvFixrirBZT",
  "C7mvIEeso2F",
  "C7ZwTH2Kd0P",
  "C7Cay3RL7FG",
] as const;
