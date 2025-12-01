# 🐳 Guía Completa: Docker y Containerización

Este documento explica cómo Docker funciona en el proyecto y cómo usarlo efectivamente.

## Índice

1. [Conceptos Fundamentales](#conceptos-fundamentales)
2. [Dockerfile Explicado](#dockerfile-explicado)
3. [Comandos Docker Comunes](#comandos-docker-comunes)
4. [Multi-Stage Build](#multi-stage-build)
5. [Optimizaciones](#optimizaciones)
6. [Docker Compose](#docker-compose)
7. [Debugging Docker](#debugging-docker)
8. [Mejores Prácticas](#mejores-prácticas)

---

## Conceptos Fundamentales

### ¿Qué es Docker?

Docker es una plataforma que permite **empaquetar tu aplicación con todas sus dependencias** en un contenedor que puede ejecutarse en cualquier máquina.

```
Sin Docker:
┌─────────────────────┐
│ Tu App              │
├─────────────────────┤
│ Node.js v20         │
├─────────────────────┤
│ npm packages        │
├─────────────────────┤
│ Sistema Operativo   │
├─────────────────────┤
│ Máquina del dev     │
└─────────────────────┘
⚠️ "En mi máquina funciona..."

Con Docker:
┌────────────────────────────┐
│    Container (Imagen)      │
├────────────────────────────┤
│  Tu App                    │
│  Node.js v20               │
│  npm packages              │
│  Ubuntu 20.04 (base)       │
├────────────────────────────┤
│  Host OS (Linux/Mac/Win)   │
└────────────────────────────┘
✅ "Funciona en cualquier máquina"
```

### Términos Clave

| Término | Explicación | Analogía |
|---------|------------|----------|
| **Image** | Plantilla (read-only) | Receta de un pastel |
| **Container** | Instancia en ejecución | Pastel horneado |
| **Dockerfile** | Instrucciones para build | Instrucciones para hacer el pastel |
| **Registry** | Repositorio de imágenes | App Store |
| **Layer** | Capa en la imagen | Capas del pastel |

### Ciclo de Vida

```
Dockerfile
    ↓
  Build
    ↓
  Image (a2d3e4f5...)
    ↓
  Run
    ↓
  Container (en ejecución)
    ↓
  Stop/Remove
    ↓
  Imágenes y Containers limpios
```

---

## Dockerfile Explicado

### Dockerfile del Proyecto

```dockerfile
# Etapa 1: Build de la aplicación
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar dependencias primero (mejora el cacheo)
COPY package*.json ./

# Instalar dependencias (incluyendo devDependencies para el build)
RUN npm ci --only=production=false

# Copiar el resto del código
COPY . .

# Construir la app para producción
RUN npm run build

# Etapa 2: Imagen final para producción
FROM node:20-alpine AS runner

WORKDIR /app

# Crear usuario no-root por seguridad 
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

ENV NODE_ENV=production

# Para Next.js standalone output 
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Cambiar a usuario no-root
USER nextjs

EXPOSE 3000
ENV PORT=3000

# Comando optimizado para Next.js standalone
CMD ["node", "server.js"]
```

### Línea por Línea

#### Etapa 1: Builder

**`FROM node:20-alpine AS builder`**
- `FROM`: Base image (imagen de inicio)
- `node:20-alpine`: Node.js v20 en Alpine Linux (muy pequeña, 150MB)
- `AS builder`: Nombre de esta etapa (reutilizable)

**Por qué `node:20`?**
- ✅ Compatible con Next.js 15
- ✅ LTS (long term support)
- ✅ Rendimiento mejorado

**Por qué `alpine`?**
- ✅ Solo 150MB vs 1GB de imagen full
- ✅ Suficiente para compilar
- ✅ Se descarta en imagen final

---

**`WORKDIR /app`**
- Establece directorio de trabajo dentro del contenedor
- Los comandos siguientes se ejecutan aquí
- Equivalente a `cd /app`

---

**`COPY package*.json ./`**
- `package*.json`: Copia `package.json` y `package-lock.json`
- `./`: Al directorio actual (`/app`)

**¿Por qué copiar dependencias primero?**
```
Docker cachea capas:

1. FROM node:20-alpine    ← Rápido (cachéado)
2. COPY package*.json     ← Rápido (cachéado)
3. RUN npm ci             ← Rápido (cachéado si no cambian)
4. COPY . .               ← Se ejecuta si cambias código
5. RUN npm run build      ← Se ejecuta si cambias código
```

Si copiaras todo primero:
- Cambias un archivo del código
- Docker invalida TODO el cache
- Reinstala dependencias (⏱️ 2 minutos)

Con este orden:
- Cambias código
- Docker rehusa layers 1-3 (cache)
- Solo rebuild el código (⏱️ 30 segundos)

---

**`RUN npm ci --only=production=false`**
- `npm ci`: Clean install (instala exactamente `package-lock.json`)
- `--only=production=false`: Incluye devDependencies

**¿Por qué devDependencies en builder?**
- Necesario para `npm run build` (que usa TypeScript, etc.)
- Se descartan en la etapa runner

---

**`RUN npm run build`**
- Ejecuta `next build`
- Compila TypeScript
- Genera `.next/` directory
- Bundlea para producción

**Output de next build:**
- `.next/standalone/` - Aplicación compilada
- `.next/static/` - Assets estáticos
- `.next/server/` - Funciones de servidor

---

#### Etapa 2: Runner (Producción)

**`FROM node:20-alpine AS runner`**
- Nueva imagen base (limpia)
- Anterior etapa builder es descartada

**¿Por qué dos etapas?**

```
Imagen final con ambas etapas:
┌─────────────────────────┐
│ node:20-alpine (~150MB) │
│ + códigocompilado (~20MB) │
│ + node_modules prod (~50MB) │
│ TOTAL: ~220MB           │
└─────────────────────────┘

Imagen final sin multi-stage:
┌─────────────────────────┐
│ node:20-alpine (~150MB) │
│ + códigocompilado (~20MB) │
│ + node_modules FULL (~800MB) │
│ + tools build (~100MB)  │
│ TOTAL: ~1070MB          │
└─────────────────────────┘

Ahorro: ~850MB = 80% más pequeña! 🚀
```

---

**`RUN addgroup --system --gid 1001 nodejs`**
**`RUN adduser --system --uid 1001 nextjs`**

- Crea usuario `nextjs` (no root)
- Ejecución como usuario no-root es más segura

**¿Por qué no root?**
```
Como root:
- Cualquier vulnerabilidad = acceso total
- No hay límites de permisos
- Riesgo: Atacante borra todo

Como nextjs:
- Solo acceso a archivos de la app
- Sin acceso a /etc, /sys, etc
- Riesgo: Atacante solo afecta a la app
```

---

**`ENV NODE_ENV=production`**
- Variables de entorno del contenedor
- `NODE_ENV=production` activa optimizaciones de Next.js

---

**`COPY --from=builder /app/public ./public`**
**`COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./`**
**`COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static`**

- `--from=builder`: Copia desde la etapa builder anterior
- `--chown=nextjs:nodejs`: Cambia propietario al usuario nextjs

**Qué copias:**
1. `public/` - Archivos estáticos públicos
2. `.next/standalone/` - Aplicación compilada
3. `.next/static/` - Assets pre-compilados

**¿Qué NO copias?**
- `node_modules` - Se reinstalan con `npm ci --only=production`
- `src/` - Ya compilado en `.next/`
- `tsconfig.json` - Ya no lo necesitas

---

**`USER nextjs`**
- Cambia usuario actual a `nextjs`
- Todos los comandos siguientes corren como este usuario

---

**`EXPOSE 3000`**
- Documenta que el puerto 3000 es importante
- No expone automáticamente (debes hacer `-p 3000:3000`)
- Es informativo

---

**`ENV PORT=3000`**
- Next.js lee `PORT` de variables de entorno
- Si ejecutas con `-e PORT=8080`, anula esto

---

**`CMD ["node", "server.js"]`**
- Comando que se ejecuta al iniciar el contenedor
- Next.js standalone genera `server.js`
- Equivalente a `node server.js`

---

## Comandos Docker Comunes

### Build de la Imagen

#### Build Básico
```bash
docker build -t next-steps:latest .
```

**Explicación:**
- `-t next-steps:latest` - Tag (nombre:versión)
- `.` - Usar Dockerfile en directorio actual

**Output:**
```
[1/10] FROM node:20-alpine
[2/10] WORKDIR /app
[3/10] COPY package*.json ./
[4/10] RUN npm ci --only=production=false
...
[10/10] RUN npm build
=> exporting to image
=> => naming to docker.io/library/next-steps:latest
```

#### Build sin Cache
```bash
docker build --no-cache -t next-steps:latest .
```

- Reconstruye todas las capas
- Útil si quieres actualizar dependencias
- Más lento (2-3 minutos)

#### Build Specific Target
```bash
docker build --target builder -t next-steps:builder .
```

- Construye solo hasta la etapa especificada
- Útil para debugging

---

### Listar Imágenes

```bash
docker images
```

**Output:**
```
REPOSITORY    TAG       IMAGE ID       SIZE
next-steps    latest    a1b2c3d4...    220MB
node          20-alpine 5e6f7g8h...    150MB
```

---

### Ejecutar Contenedor

#### Run Básico
```bash
docker run -p 3000:3000 next-steps:latest
```

**Explicación:**
- `run` - Crear y ejecutar contenedor
- `-p 3000:3000` - Port mapping (host:contenedor)
- `next-steps:latest` - Imagen a usar

**Output:**
```
> next-steps@0.1.0 start
> next start

  ▲ Next.js 15.4.6 (standalone)

  ▪ Ready on 0.0.0.0:3000
```

#### Run en Background
```bash
docker run -d -p 3000:3000 --name my-app next-steps:latest
```

**Flags:**
- `-d` - Detached (background)
- `--name my-app` - Nombre del contenedor

**Control:**
```bash
docker ps                    # Ver contenedores activos
docker logs my-app          # Ver logs
docker stop my-app          # Detener
docker start my-app         # Reiniciar
```

#### Run con Variables de Entorno
```bash
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e SECRET_KEY=abc123 \
  next-steps:latest
```

#### Run con Archivo .env
```bash
docker run -p 3000:3000 \
  --env-file .env.production \
  next-steps:latest
```

---

### Limpiar Docker

#### Eliminar Contenedor
```bash
docker rm container-id
```

#### Eliminar Imagen
```bash
docker rmi next-steps:latest
```

#### Limpiar Todo
```bash
docker system prune -a
```

**Advertencia:** Elimina todas las imágenes y contenedores no usados.

---

## Multi-Stage Build

### ¿Por qué Multi-Stage?

**Single-stage (malo):**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

**Problema:**
- Imagen final: 1.2GB (incluye build tools, devDependencies, etc.)

**Multi-stage (bueno):**
```dockerfile
# Etapa 1: Build
FROM node:20-alpine AS builder
...

# Etapa 2: Runtime
FROM node:20-alpine AS runner
COPY --from=builder /app/.next ./
...
```

**Ventaja:**
- Imagen final: 220MB (solo runtime)
- 82% más pequeña
- Más rápido descargar/deployar

---

### Pattern: Build → Runtime

```
┌──────────────────────────────┐
│  Etapa 1: Builder            │
├──────────────────────────────┤
│ - node:20-alpine (150MB)     │
│ - npm dependencies (800MB)   │
│ - build tools                │
│ - TypeScript, ESLint, etc    │
│ Total: 1.2GB                 │
└──────────────────────────────┘
         ↓ npm run build ↓
┌──────────────────────────────┐
│  Artifacts                   │
├──────────────────────────────┤
│ - .next/                     │
│ - public/                    │
│ - package.json               │
└──────────────────────────────┘
         ↓ COPY --from=builder ↓
┌──────────────────────────────┐
│  Etapa 2: Runner             │
├──────────────────────────────┤
│ - node:20-alpine (150MB)     │
│ - Artifacts (20MB)           │
│ - npm packages (50MB)        │
│ Total: 220MB ← 82% savings! │
└──────────────────────────────┘
```

---

## Optimizaciones

### 1. Layer Caching

**Problemas:**
```dockerfile
# ❌ Ineficiente
FROM node:20-alpine
COPY . .                    # Copiar todo primero
RUN npm ci
RUN npm run build
```

- Cambias un archivo
- Docker invalida TODAS las capas posteriores
- Reinstala todas las dependencias

**Solución:**
```dockerfile
# ✅ Eficiente
FROM node:20-alpine
COPY package*.json ./       # Copiar solo dependencias
RUN npm ci
COPY . .                    # Copiar el resto
RUN npm run build
```

- Cambias un archivo
- Las capas de npm se usan del cache
- Solo se rebuild el código

---

### 2. Alpine Linux

```dockerfile
# ❌ Grande
FROM node:20
# Tamaño: 1GB

# ✅ Pequeña
FROM node:20-alpine
# Tamaño: 150MB
```

- Alpine tiene lo mínimo (solo necesario)
- Suficiente para ejecutar Node.js
- 85% más pequeña

---

### 3. Standalone Next.js Output

```dockerfile
# ❌ Copia todo
COPY .next .next
COPY node_modules node_modules
# Tamaño: 1GB+

# ✅ Solo necesario
COPY .next/standalone ./
COPY .next/static ./.next/static
# Tamaño: 70MB
```

- Next.js puede compilarse a `standalone`
- Incluye todo lo necesario
- Sin necesidad de `next start`, corre `node server.js`

**En next.config.ts:**
```typescript
export default {
  output: 'standalone',
};
```

---

### 4. No-Root User

```dockerfile
# ❌ Menos seguro
USER root

# ✅ Más seguro
RUN adduser --system nextjs
USER nextjs
```

- Limita permisos de vulnerabilidades
- Mejor para entornos de producción

---

## Docker Compose

### Archivo docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    container_name: next-steps-app
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      PORT: 3000
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### Ejecutar con Docker Compose

```bash
# Iniciar
docker-compose up

# Iniciar en background
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

### Con Multiple Servicios

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - db
    environment:
      DATABASE_URL: postgresql://user:pass@db:5432/db

  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## Debugging Docker

### Ver Logs del Contenedor

```bash
docker logs container-id
docker logs -f container-id      # Follow (en vivo)
docker logs --tail 100 container-id  # Últimas 100 líneas
```

### Ejecutar Comandos en Contenedor

```bash
# Ver archivos
docker exec container-id ls -la /app

# Entrar a bash
docker exec -it container-id sh

# Chequear variables de entorno
docker exec container-id env
```

### Inspecccionar Imagen

```bash
# Ver layers
docker history next-steps:latest

# Información detallada
docker inspect next-steps:latest

# Tamaño de cada layer
docker history --human --no-trunc next-steps:latest
```

### Build Verbose

```bash
docker build --progress=plain -t next-steps:latest .
```

Muestra cada paso en detalle.

---

## Mejores Prácticas

### 1. .dockerignore

Crear `.dockerignore` en la raíz:

```
node_modules
npm-debug.log
.git
.gitignore
.env
.env.local
dist
build
.next
.vscode
.DS_Store
```

Evita copiar archivos innecesarios.

---

### 2. Versionado de Imágenes

```bash
docker build -t next-steps:0.1.0 .
docker build -t next-steps:latest .
```

Mantén historia de versiones para rollback.

---

### 3. Scanning de Vulnerabilidades

```bash
docker scout cves next-steps:latest
```

Checkea CVEs en dependencias.

---

### 4. Documentar con Comments

```dockerfile
# Etapa 1: Compilar Next.js
# - Incluye devDependencies para TypeScript
# - Output optimizado en .next/standalone
FROM node:20-alpine AS builder

# ... más comentarios ...
```

---

### 5. Testing en Dockerfile

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Test stage
RUN npm run test:run || exit 1

RUN npm run build

# ... rest ...
```

Falla el build si los tests no pasan.

---

## Resumen

| Concepto | Uso |
|----------|-----|
| **FROM** | Define imagen base |
| **WORKDIR** | Directorio de trabajo |
| **COPY** | Copia archivos al contenedor |
| **RUN** | Ejecuta comando |
| **ENV** | Variables de entorno |
| **EXPOSE** | Documenta puerto |
| **USER** | Usuario de ejecución |
| **CMD** | Comando al iniciar |
| **Multi-stage** | Reduce tamaño final (80-90%) |
| **Alpine** | Imagen ligera (150MB vs 1GB) |

**Key Takeaway:** Multi-stage + Alpine = Imágenes eficientes y seguras ✅

---
