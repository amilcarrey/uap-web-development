# Dockerfile para aplicación Next.js - LibrosyReview
# Multi-stage build para optimizar el tamaño de la imagen final

# Etapa 1: Dependencias
FROM node:18-alpine AS deps
# Instalar libc6-compat para compatibilidad con Alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copiar archivos de configuración de dependencias
COPY package.json package-lock.json* ./
# Instalar dependencias de producción y desarrollo
RUN npm ci

# Etapa 2: Builder
FROM node:18-alpine AS builder
WORKDIR /app
# Copiar dependencias desde la etapa anterior
COPY --from=deps /app/node_modules ./node_modules
# Copiar código fuente
COPY . .

# Variables de entorno para el build
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Construir la aplicación
RUN npm run build

# Etapa 3: Runner (imagen final)
FROM node:18-alpine AS runner
WORKDIR /app

# Variables de entorno para producción
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Crear usuario no-root para seguridad
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos necesarios para la ejecución
COPY --from=builder /app/public ./public

# Copiar archivos de build con permisos correctos
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Cambiar al usuario no-root
USER nextjs

# Exponer puerto 3000
EXPOSE 3000

# Variables de entorno para el contenedor
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Comando para iniciar la aplicación
CMD ["node", "server.js"]