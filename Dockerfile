# ── Stage 1: Build ──────────────────────────────────────────────────────────
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Dependencias primero (mejor cache de Docker)
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Resto del código
COPY . .

# Variables PUBLIC_* (client-side) necesarias en build-time: se "hornean" en el bundle.
# Se pasan como ARGs desde Cloud Build.
ARG PUBLIC_SUPABASE_URL
ARG PUBLIC_SUPABASE_ANON_KEY
ARG PUBLIC_SANITY_PROJECT_ID
ARG SANITY_DATASET
ARG PUBLIC_MP_PUBLIC_KEY

ENV PUBLIC_SUPABASE_URL=$PUBLIC_SUPABASE_URL
ENV PUBLIC_SUPABASE_ANON_KEY=$PUBLIC_SUPABASE_ANON_KEY
ENV PUBLIC_SANITY_PROJECT_ID=$PUBLIC_SANITY_PROJECT_ID
ENV SANITY_DATASET=$SANITY_DATASET
ENV PUBLIC_MP_PUBLIC_KEY=$PUBLIC_MP_PUBLIC_KEY

# Server-only requeridas por el schema astro:env → dummies SOLO para que el build valide.
# Los valores reales se inyectan en Cloud Run en runtime, nunca entran a la imagen.
ENV RESEND_API_KEY=dummy-build \
    RESEND_FROM=dummy@build.com \
    RESEND_TO=dummy@build.com \
    UPSTASH_REDIS_REST_URL=https://dummy.upstash.io \
    UPSTASH_REDIS_REST_TOKEN=dummy-token \
    SANITY_API_TOKEN=dummy-token

RUN bun run build

# ── Stage 2: Runtime ─────────────────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

# Solo lo necesario para producción
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Cloud Run inyecta PORT=8080; el server debe escuchar en 0.0.0.0.
ENV PORT=8080
ENV HOST=0.0.0.0
ENV NODE_ENV=production

EXPOSE 8080

CMD ["node", "./dist/server/entry.mjs"]
