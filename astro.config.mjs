// @ts-check
import { defineConfig, envField } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import vercel from '@astrojs/vercel';

import icon from 'astro-icon';

import react from '@astrojs/react';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.sonqoperu.com',
  trailingSlash: 'never',

  output: 'server',

  adapter: vercel({
    imageService: true,
    maxDuration: 30,
  }),
  server: { port: 8090 },
  security: { checkOrigin: true },
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  integrations: [
    icon(),
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: { es: 'es-PE', en: 'en-US' },
      },
      filter: (page) =>
        !/\/(checkout|thanks)(\/|$)/.test(new URL(page).pathname),
    }),
  ],

  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: false },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  env: {
    schema: {
      // MercadoPago — opcionales mientras no haya keys (el código degrada sin romper).
      MP_ACCESS_TOKEN: envField.string({ context: 'server', access: 'secret' }),
      PUBLIC_MP_PUBLIC_KEY: envField.string({ context: 'client', access: 'public' }),
      MP_WEBHOOK_SECRET: envField.string({ context: 'server', access: 'secret' }),

      // Sanity — PROJECT_ID y dataset públicos. Lectura en build con dataset
      PUBLIC_SANITY_PROJECT_ID: envField.string({ context: 'client', access: 'public' }),
      SANITY_DATASET: envField.string({ context: 'client', access: 'public' }),
      // Resend — API key secreta + remitente/destino del formulario. Requeridas.
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret' }),
      RESEND_FROM: envField.string({ context: 'server', access: 'public' }),
      RESEND_TO: envField.string({ context: 'server', access: 'public' }),

      // Google Tag Manager — contenedor que carga GA4/pixels. Opcional: vacío en
      PUBLIC_GTM_ID: envField.string({ context: 'client', access: 'public', optional: true }),

      // Supabase — anon (leads) requeridas. Service key (donaciones, bypass RLS) opcional:
      // el webhook degrada sin romper hasta que se configure.
      PUBLIC_SUPABASE_URL: envField.string({ context: 'client', access: 'public' }),
      PUBLIC_SUPABASE_ANON_KEY: envField.string({ context: 'client', access: 'public' }),
      SUPABASE_SERVICE_KEY: envField.string({ context: 'server', access: 'secret' }),

      // Upstash Redis — rate limiting. Secretas, solo server.
      UPSTASH_REDIS_REST_URL: envField.string({ context: 'server', access: 'secret' }),
      UPSTASH_REDIS_REST_TOKEN: envField.string({ context: 'server', access: 'secret' }),
    },
  },
});
