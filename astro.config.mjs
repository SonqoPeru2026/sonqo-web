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
      // MercadoPago — requeridas, sin optional
      MP_ACCESS_TOKEN: envField.string({ context: 'server', access: 'secret' }),
      PUBLIC_MP_PUBLIC_KEY: envField.string({ context: 'client', access: 'public' }),

      // Sanity — un solo PROJECT_ID público, token secreto
      PUBLIC_SANITY_PROJECT_ID: envField.string({ context: 'client', access: 'public', optional: true }),
      SANITY_DATASET: envField.string({ context: 'client', access: 'public', default: 'production' }),
      SANITY_API_TOKEN: envField.string({ context: 'server', access: 'secret', optional: true }),

      // Resend — API key secreta + remitente/destino del formulario
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      RESEND_FROM: envField.string({ context: 'server', access: 'public', optional: true }),
      RESEND_TO: envField.string({ context: 'server', access: 'public', optional: true }),

      // Google Analytics
      PUBLIC_GA_MEASUREMENT_ID: envField.string({ context: 'client', access: 'public', optional: true }),

      // Supabase
      PUBLIC_SUPABASE_URL: envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_SUPABASE_ANON_KEY: envField.string({ context: 'client', access: 'public', optional: true }),
    },
  },
});
