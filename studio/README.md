# Sonqo — Studio (Sanity CMS)

Panel para que el equipo edite contenido del sitio **sin tocar código**.
Sanity lo hostea gratis en `*.sanity.studio`. No pesa en el build de Astro.

## Qué se edita aquí

| Sección del Studio | Alimenta a | Fallback si está vacío |
|---|---|---|
| Configuración del sitio | Números de impacto, metas de campaña, imagen de /donate | Valores actuales en código |
| Slides del inicio | Carrusel del Hero (foto + título + texto, ES/EN) | Slides actuales en código |
| Galería | Mosaico de fotos de /gallery (reels y videos siguen en código) | Fotos actuales en código |
| Paquetes de donación | Nombre y frase de impacto de las 4 cards | Textos del i18n |

**Los precios NO se editan aquí**: viven en `src/lib/donation.ts` porque
alimentan el flujo de pago seguro. Cambio de precio = tarea de developer.

Los textos bilingües muestran ES y EN lado a lado; no se puede publicar si
falta un idioma (misma garantía de paridad que el i18n del sitio).

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
   - Filter (opcional): `_type in ["siteSettings", "heroSlide", "galleryPhoto", "donationPackage"]`.

Resultado: el equipo publica → Sanity llama al hook → Vercel rebuildea → el dato
nuevo sale en vivo (~1–2 min). Cambios raros → pocos builds/mes, dentro del free tier.
