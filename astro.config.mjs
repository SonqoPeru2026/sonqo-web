// @ts-check
import { defineConfig, envField } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import vercel from '@astrojs/vercel';

import icon from 'astro-icon';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://sonqoperu.com',
  trailingSlash: 'never',

  output: 'server',

  adapter: vercel({
    imageService: true,
    maxDuration: 30,
  }),
  security: { checkOrigin: true },
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  integrations: [icon(), react()],

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
      // MercadoPago — pendiente para el final. Descomentar al integrar pagos.
      // MP_ACCESS_TOKEN: envField.string({ context: 'server', access: 'secret' }),
      // PUBLIC_MP_PUBLIC_KEY: envField.string({ context: 'client', access: 'public' }),

      // Sanity — un solo PROJECT_ID público, token secreto. Requeridas.
      PUBLIC_SANITY_PROJECT_ID: envField.string({ context: 'client', access: 'public' }),
      SANITY_DATASET: envField.string({ context: 'client', access: 'public' }),
      SANITY_API_TOKEN: envField.string({ context: 'server', access: 'secret' }),

      // Resend — API key secreta + remitente/destino del formulario. Requeridas.
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret' }),
      RESEND_FROM: envField.string({ context: 'server', access: 'public' }),
      RESEND_TO: envField.string({ context: 'server', access: 'public' }),

      // Google Analytics — pendiente para el final. Descomentar al configurar GA4.
      // PUBLIC_GA_MEASUREMENT_ID: envField.string({ context: 'client', access: 'public' }),

      // Supabase — requeridas.
      PUBLIC_SUPABASE_URL: envField.string({ context: 'client', access: 'public' }),
      PUBLIC_SUPABASE_ANON_KEY: envField.string({ context: 'client', access: 'public' }),
    },
  },
});
