# Sonqo — Studio (Sanity CMS)

Panel para que el equipo edite números e imágenes del sitio **sin tocar código**.
Sanity lo hostea gratis en `*.sanity.studio`. No pesa en el build de Astro.

## Setup (una vez)

```bash
cd studio
bun install
bunx sanity login        # entrar con la cuenta dueña del proyecto pq113h64
```

## Correr en local

```bash
bun run dev              # http://localhost:3333
```

## Publicar el Studio (hosted, gratis)

```bash
bun run deploy           # elige un subdominio: sonqo.sanity.studio
```

## Datasets

El dataset sale de `SANITY_STUDIO_DATASET` (en `.env`). Para producción:
`SANITY_STUDIO_DATASET=production bun run deploy` (o ponlo en el `.env`). Ambos
datasets deben ser **públicos** (sanity.io/manage → API → Datasets) para que el
sitio lea sin token.

## Refresh automático del sitio (webhook → rebuild)

El sitio lee Sanity en **build** (no por visita). Para que un "Publish" actualice
el sitio solo:

1. **Vercel** → Project → Settings → Git → **Deploy Hooks** → crear hook (rama de
   producción). Copia la URL.
2. **Sanity** → manage → API → **Webhooks** → New webhook:
   - URL = el Deploy Hook de Vercel.
   - Dataset = `production`. Trigger = on **create/update/delete**.
   - Filter (opcional): `_type == "siteSettings"`.

Resultado: el equipo publica → Sanity llama al hook → Vercel rebuildea → el dato
nuevo sale en vivo (~1–2 min). Cambios raros → pocos builds/mes, dentro del free tier.
