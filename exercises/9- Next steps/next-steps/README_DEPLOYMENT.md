# 📚 Plataforma de Descubrimiento y Reseñas de Libros - Documentación de Deploy y CI/CD

Una aplicación moderna web para descubrir, explorar y escribir reseñas sobre libros, construida con **Next.js 15**, **React 19**, **TypeScript** y **Tailwind CSS**.

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Instalación y Setup Local](#instalación-y-setup-local)
4. [Desarrollo Local](#desarrollo-local)
5. [Testing](#testing)
6. [Docker](#docker)
7. [GitHub Actions (CI/CD)](#github-actions-cicd)
8. [Variables de Entorno](#variables-de-entorno)
9. [Deploy en Producción](#deploy-en-producción)
10. [Estructura del Proyecto](#estructura-del-proyecto)
11. [Troubleshooting](#troubleshooting)

---

## Descripción General

**Next Steps** es una plataforma moderna para gestión y reseña de libros que permite a usuarios:

✅ Descubrir libros nuevos y populares  
✅ Escribir y compartir reseñas personalizadas  
✅ Calificar libros  
✅ Explorar reseñas de otros usuarios  
✅ Crear listas personalizadas  

**Características técnicas:**
- ⚡ Última versión de Next.js con Turbopack
- 🎨 Diseño responsive con Tailwind CSS
- ✓ Suite completa de tests con Vitest
- 🐳 Containerización con Docker (multi-stage build)
- 🔄 CI/CD con GitHub Actions
- 📦 Optimización automática de performance

---

## Stack Tecnológico

| Capa | Tecnologías |
|------|------------|
| **Framework** | Next.js 15.4.6 |
| **Runtime** | Node.js 20+ |
| **Frontend** | React 19.1.0, TypeScript 5+ |
| **Styling** | Tailwind CSS 4 |
| **Testing** | Vitest 3.2.4 + Testing Library |
| **Linting** | ESLint 9 |
| **Build** | Next.js (Turbopack) |
| **Containerización** | Docker (Multi-stage) |
| **CI/CD** | GitHub Actions |

---

## Instalación y Setup Local

### Requisitos Previos

- **Node.js**: v20 o superior ([Descargar](https://nodejs.org))
- **npm**: v10 o superior (incluido con Node.js)
- **Git**: Para clonar el repositorio
- **Docker** (opcional): Para ejecutar en contenedores

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/santibaezagraf/uap-web-development.git
cd "exercises/9- Next steps/next-steps"
```

### Paso 2: Instalar Dependencias

```bash
npm install
```

Esto instalará:
- `next` - Framework Next.js
- `react` y `react-dom` - Librerías de UI
- `tailwindcss` - Framework de CSS
- `vitest` - Framework de testing
- Todas las devDependencies para desarrollo

### Paso 3: Verificar Instalación

```bash
npm run build
```

Esto debería compilar la aplicación sin errores. Si ves errores, revisa la sección [Troubleshooting](#troubleshooting).

---

## Desarrollo Local

### Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

Salida esperada:
```
> next dev --turbopack

  ▲ Next.js 15.4.6
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 1.2s
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Hot Reload

El servidor detectará cambios automáticamente:
- Modificaciones en `app/` se reflejan al guardar
- Cambios en CSS se aplican instantáneamente
- No necesitas reiniciar manualmente

### Estructura de Desarrollo

```
src/
├── app/                    # App Router de Next.js
│   ├── page.tsx           # Página principal
│   ├── layout.tsx         # Layout raíz
│   ├── globals.css        # Estilos globales
│   ├── actions.ts         # Server actions
│   └── components/        # Componentes React
├── lib/                   # Utilidades compartidas
│   ├── types.ts          # Tipos TypeScript
│   └── memoryDB.ts       # Base de datos en memoria
└── test/                 # Configuración de tests
    └── setup.ts          # Setup de Vitest
```

### Scripts Disponibles

| Script | Comando | Descripción |
|--------|---------|------------|
| **Desarrollo** | `npm run dev` | Inicia servidor con hot reload |
| **Build** | `npm run build` | Compila para producción |
| **Start** | `npm run start` | Ejecuta servidor de producción |
| **Lint** | `npm run lint` | Verifica calidad de código |
| **Tests** | `npm run test` | Ejecuta tests en watch mode |
| **Tests (CI)** | `npm run test:run` | Ejecuta tests una sola vez |
| **Tests UI** | `npm run test:ui` | Abre interfaz visual de tests |

---

## Testing

### Ejecutar Tests Localmente

#### En modo watch (desarrollo):
```bash
npm run test
```

El servidor espera cambios y re-ejecuta tests automáticamente. Perfecto para TDD.

#### Una sola ejecución (CI):
```bash
npm run test:run
```

Ejecuta todos los tests e imprime resultados. Útil en pipelines CI/CD.

#### Con interfaz visual:
```bash
npm run test:ui
```

Abre una interfaz web en `http://localhost:51204` con:
- Vista de todos los tests
- Resultados en tiempo real
- Reportes de cobertura
- Búsqueda y filtrado

### Estructura de Tests

```
src/
├── app/
│   ├── page.test.tsx      # Tests del componente Page
│   ├── actions.test.ts    # Tests de server actions
│   └── components/
│       └── reviews.test.tsx  # Tests del componente Reviews
└── lib/
    └── memoryDB.test.ts   # Tests de la BD
```

### Escribir Nuevos Tests

Ejemplo básico:
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('debe renderizar el componente', () => {
    render(<MyComponent />);
    expect(screen.getByRole('heading')).toHaveTextContent('Título');
  });
});
```

---

## Docker

### Construir Imagen Localmente

```bash
docker build -t next-steps:latest .
```

### Ejecutar Contenedor

```bash
docker run -p 3000:3000 next-steps:latest
```

Accede a [http://localhost:3000](http://localhost:3000)

### Explicación del Dockerfile

El `Dockerfile` usa **multi-stage build** para optimización:

#### Etapa 1: Builder
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production=false
COPY . .
RUN npm run build
```

- Instala todas las dependencias (incluyendo devDeps)
- Compila la aplicación Next.js
- Genera output optimizado en `.next/`

#### Etapa 2: Runner (Producción)
```dockerfile
FROM node:20-alpine AS runner
WORKDIR /app

# Usuario no-root por seguridad
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar solo lo necesario del builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
```

**Beneficios:**
- ✅ Imagen final muy pequeña (solo runtime necesario)
- ✅ Sin devDependencies en producción
- ✅ Usuario no-root por seguridad
- ✅ Standalone output optimizado de Next.js

### Docker Compose (Opcional)

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
    restart: unless-stopped
```

Ejecutar:
```bash
docker-compose up
```

---

## GitHub Actions (CI/CD)

### ¿Qué son GitHub Actions?

GitHub Actions es un servicio de automatización integrado en GitHub que permite ejecutar workflows (secuencias de tareas) automáticamente cuando ocurren eventos específicos.

**Ejemplos de eventos:**
- 📌 Push a una rama
- 🔄 Pull Request creado/actualizado
- 📅 Programado (cron)
- 👆 Manual (workflow dispatch)

---

### Workflows Configurados

Tres workflows automáticos garantizan calidad:

#### 1️⃣ **Build on Pull Request** (`.github/workflows/build.yml`)

**Cuándo se ejecuta:**
- 🔄 En cada Pull Request (nuevo o actualizado)
- 🎯 Se puede ejecutar manualmente desde GitHub

**Qué hace:**
```
1. Descarga el código del PR (checkout)
2. Instala Node.js v20 (con cache npm para velocidad)
3. Instala dependencias con npm ci
4. Ejecuta npm run build (compilación)
```

**Resultado:**
- ✅ Verde si el build es exitoso
- ❌ Rojo si falla la compilación

**Visualización en GitHub:**
- Tab "Checks" en el PR
- Badge en el comentario de commit
- En "Actions" → "Build on Pull Request"

**Logs:**
- Click en "Details" para ver output completo
- Logs de npm build si falla

#### 2️⃣ **Run Tests on Pull Request** (`.github/workflows/test.yml`)

**Cuándo se ejecuta:**
- 🔄 En cada Pull Request
- 🎯 Ejecución manual disponible

**Qué hace:**
```
1. Descarga el código
2. Instala Node.js v20 (con cache)
3. Instala dependencias (npm ci)
4. Ejecuta npm run test:run (tests unitarios)
```

**Resultado:**
- ✅ Todos los tests pasan
- ❌ Algún test falló

**Requisito:** Los tests deben pasar para poder mergear a main

**Logs:**
- Ver resultados de Vitest en "Details"
- Output de cada test
- Coverage si está configurado

#### 3️⃣ **Build & Push Docker Image** (`.github/workflows/docker.yml`)

**Cuándo se ejecuta:**
- 🚀 Solo cuando se mergea código a `main` branch (push a main)
- 🎯 Se puede ejecutar manualmente

**Qué hace:**
```
1. Descarga el código de main
2. Configura Docker Buildx (builder multi-plataforma)
3. Autentica con GitHub Container Registry (ghcr.io)
4. Construye imagen para:
   - linux/amd64 (Intel/AMD x86_64)
   - linux/arm64 (M1/M2 Apple Silicon)
5. Publica en ghcr.io/usuario/repo
```

**Tags generados automáticamente:**
- `ghcr.io/usuario/repo:main` - Branch tag
- `ghcr.io/usuario/repo:main-abc123d4` - Commit hash (short)
- `ghcr.io/usuario/repo:latest` - Latest tag (si es main)

**Ejemplo real:**
```
ghcr.io/santibaezagraf/uap-web-development:latest
ghcr.io/santibaezagraf/uap-web-development:main-a1b2c3d4
ghcr.io/santibaezagraf/uap-web-development:main
```

**Plataformas soportadas:**
- Linux AMD64 (Servidores Intel/AMD, Docker Desktop)
- Linux ARM64 (M1/M2 Mac, Servidores ARM, Raspberry Pi)

---

### Flujo Completo de CI/CD (Diagram)

```
┌─────────────────────────────────────┐
│  Developer hace commit y push       │
│  git push origin feature-branch     │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  GitHub detecta cambios             │
│  Crea Pull Request                  │
└──────────────┬──────────────────────┘
               │
        ┌──────┴────────┐
        │               │
        ▼               ▼
   ┌─────────┐   ┌──────────┐
   │ Build   │   │  Tests   │
   │ Workflow│   │ Workflow │
   └─────────┘   └──────────┘
        │               │
        │ npm build     │ npm test:run
        │ compile TS    │ vitest
        │               │
        └──────┬────────┘
               │
               ▼
        ¿Pasan todos?
               │
        ┌──────┴──────┐
        │             │
       NO            SÍ
        │             │
        ▼             ▼
    ❌ Requiere   ✅ Listo
    Fixes        para mergear
        │             │
        │             ▼
        │      ┌──────────────┐
        │      │  Developer   │
        │      │  Mergea PR   │
        │      │  a main      │
        │      └──────┬───────┘
        │             │
        │             ▼
        │      ┌────────────────┐
        │      │  Push a main   │
        │      │  detectado     │
        │      └──────┬─────────┘
        │             │
        │             ▼
        │      ┌────────────────────────┐
        │      │  Docker Build Workflow │
        │      ├────────────────────────┤
        │      │ - docker build         │
        │      │ - docker push          │
        │      │ - ghcr.io/user/repo    │
        │      └────────────────────────┘
        │             │
        │             ▼
        │      ┌────────────────────┐
        │      │  Imagen disponible │
        │      │  en registry       │
        │      │  ghcr.io/...latest │
        │      └────────────────────┘
        │
        └───── (retomado luego de fixes)
```

---

### Monitorear Workflows

#### 1️⃣ **En GitHub (Interfaz Web)**

**Ver todos los workflows:**
1. Ir a tu repositorio
2. Tab "Actions" en la barra superior
3. Ver lista de todos los runs
4. Click en un run para ver detalles

**Ver detalles de un workflow específico:**
1. Tab "Actions" → "Build on Pull Request"
2. Ver histórico de ejecuciones
3. Click en una para ver logs completos

**En el Pull Request:**
1. Abrir PR
2. Ir a tab "Checks" (o "Conversations")
3. Ver status de cada workflow
4. Click en "Details" para expandir
5. Click en job para ver logs

**Logs detallados:**
- Expandir cada step
- Ver output de npm
- Ver errores de compilación o tests

#### 2️⃣ **Status Badges en README**

Agregar badges de status al README:

```markdown
![Build](https://github.com/usuario/repo/actions/workflows/build.yml/badge.svg)
![Tests](https://github.com/usuario/repo/actions/workflows/test.yml/badge.svg)
![Docker](https://github.com/usuario/repo/actions/workflows/docker.yml/badge.svg)
```

#### 3️⃣ **Notificaciones**

GitHub envía notificaciones automáticas cuando:
- ✅ Un workflow pasa
- ❌ Un workflow falla
- 🔄 Un workflow está en progreso

Configurar en Settings → Notifications

---

### Secrets y Variables de Entorno

#### Secrets (Información Sensible)

El workflow de Docker usa `secrets.GITHUB_TOKEN` automáticamente:
- ✅ No requiere configuración manual
- ✅ Token generado automáticamente por GitHub
- ✅ Válido solo durante la ejecución del workflow
- ✅ Se usa para autenticar con ghcr.io

#### Agregar Otros Secrets (Si Necesitas)

1. Ir a tu repositorio
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Nombre: `NOMBRE_SECRETO` (MAYÚSCULAS)
5. Valor: tu valor secreto

**Usar en workflows:**
```yaml
- run: comando con ${{ secrets.NOMBRE_SECRETO }}
```

#### Variables de Entorno (No Sensibles)

Para valores públicos/compartidos:
1. Settings → Secrets and variables → Variables
2. Click "New repository variable"
3. Nombre: `NOMBRE_VAR`
4. Valor: valor público

**Usar en workflows:**
```yaml
- run: comando con ${{ vars.NOMBRE_VAR }}
```

---

### Ejemplos de Workflow Real

#### Simulación: Un developer crea un PR

```
1. Developer: git push origin feature/new-feature
2. GitHub Actions inicia automáticamente:

   ✅ Build Workflow
   ├─ checkout@v4
   ├─ setup-node@v4 con cache: npm
   ├─ npm ci                    (⏱ 45s)
   └─ npm run build             (⏱ 2m)
      Output: Generated .next/

   ✅ Test Workflow
   ├─ checkout@v4
   ├─ setup-node@v4 con cache: npm
   ├─ npm ci                    (⏱ 30s)
   └─ npm run test:run          (⏱ 15s)
      Output: 12 passed in 1s

3. GitHub muestra en el PR:
   ✅ Build (All checks passed)
   ✅ Tests (All checks passed)
   
4. Developer puede mergear! 🎉

5. Al mergear a main:
   
   ✅ Docker Build Workflow
   ├─ checkout@v4
   ├─ setup-buildx-action@v3
   ├─ login-action@v3 (GitHub Container Registry)
   ├─ metadata-action@v5 (generar tags)
   └─ build-push-action@v5      (⏱ 3m)
      Output: Pushing to ghcr.io/santibaezagraf/uap-web-development:latest
      
6. Imagen disponible para deployment! 🚀
```

---

## Variables de Entorno

### Setup Inicial

#### `.env.local` (Desarrollo)

Crear archivo en la raíz del proyecto:

```env
# Base URL de la API
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Variables públicas (accesibles en frontend)
NEXT_PUBLIC_APP_NAME=BookReviews
NEXT_PUBLIC_APP_VERSION=0.1.0

# Variables privadas (solo backend/server actions)
DATABASE_URL=file:./data.db
SECRET_KEY=dev-secret-key-insecure-change-in-production
NODE_ENV=development
```

#### `.env.production` (Producción)

Para despliegues en Vercel o similar:

```env
NEXT_PUBLIC_API_URL=https://api.tu-dominio.com
NEXT_PUBLIC_APP_NAME=BookReviews
DATABASE_URL=postgresql://user:pass@host/db
SECRET_KEY=your-secure-production-key-use-strong-random-value
NODE_ENV=production
```

### Variables Disponibles

| Variable | Scope | Descripción | Ejemplo |
|----------|-------|-------------|---------|
| `NEXT_PUBLIC_*` | Público | Accesible desde cliente | `NEXT_PUBLIC_API_URL` |
| `DATABASE_URL` | Privado | Conexión BD (server only) | `postgresql://...` |
| `SECRET_KEY` | Privado | Clave secreta | Usa `openssl rand -base64 32` |
| `NODE_ENV` | Sistema | development \| production | `production` |

### En Docker

Pasar variables:

```bash
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e SECRET_KEY=tu-clave-segura \
  -e DATABASE_URL=postgresql://... \
  next-steps:latest
```

O con `.env` file:

```bash
docker run -p 3000:3000 \
  --env-file .env.production \
  next-steps:latest
```

---

## Deploy en Producción

### Opción 1: Vercel (Recomendado)

**Ventajas:**
- ⚡ Optimizado para Next.js
- 🚀 Deploy automático en cada push
- 🌍 CDN global
- 📊 Analytics integrado
- ✅ Fácil setup

**Pasos:**

1. Ir a [vercel.com](https://vercel.com)
2. Conectar repositorio GitHub
3. Seleccionar rama: `main`
4. Variables de entorno:
   - Agregar `NEXT_PUBLIC_API_URL`
   - Agregar `DATABASE_URL` si es necesario
5. Click "Deploy"

Vercel detectará automáticamente que es Next.js y aplicará las configuraciones correctas.

### Opción 2: Docker Registry + Cualquier Host

**Con Docker Image en ghcr.io:**

1. Imagen se construye automáticamente por GitHub Actions
2. Disponible en: `ghcr.io/tu-usuario/tu-repo:latest`
3. Deploy en:
   - Render.com
   - Railway.app
   - Heroku
   - DigitalOcean
   - AWS ECS
   - Cualquier servidor con Docker

**Ejemplo en Railway:**

```bash
railway link
railway variables set NEXT_PUBLIC_API_URL=...
railway deploy
```

### Opción 3: Node Server Manual

```bash
# Compilar
npm run build

# Ejecutar
npm start
```

Luego usar PM2 o supervisor para mantener el proceso activo.

---

## Estructura del Proyecto

```
next-steps/
├── .github/
│   └── workflows/                    # GitHub Actions CI/CD
│       ├── build.yml                 # Build en PRs
│       ├── test.yml                  # Tests en PRs
│       └── docker.yml                # Build & push Docker
│
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Layout raíz
│   │   ├── page.tsx                  # Página principal
│   │   ├── globals.css               # Estilos globales
│   │   ├── actions.ts                # Server actions
│   │   ├── actions.test.ts           # Tests de actions
│   │   ├── page.test.tsx             # Tests de página
│   │   └── components/
│   │       ├── reviews.tsx           # Componente Reviews
│   │       └── reviews.test.tsx      # Tests Reviews
│   │
│   ├── lib/                          # Utilidades
│   │   ├── types.ts                  # Tipos TypeScript
│   │   ├── memoryDB.ts               # BD en memoria
│   │   └── memoryDB.test.ts          # Tests BD
│   │
│   └── test/
│       └── setup.ts                  # Setup Vitest
│
├── public/                           # Archivos estáticos
│
├── .gitignore
├── dockerfile                        # Multi-stage build
├── eslint.config.mjs                # ESLint config
├── next.config.ts                   # Next.js config
├── package.json                     # Dependencias
├── postcss.config.mjs               # PostCSS (Tailwind)
├── README.md                         # Documentación
├── tsconfig.json                    # TypeScript config
└── vitest.config.ts                 # Vitest config
```

---

## Troubleshooting

### Error: "Module not found"

```
Error: Cannot find module 'next'
```

**Solución:**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

### Error: "Port 3000 already in use"

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solución 1: Cambiar puerto**
```bash
npm run dev -- -p 3001
```

**Solución 2: Liberar puerto**
```bash
# En Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# En macOS/Linux
lsof -ti:3000 | xargs kill -9
```

---

### Tests fallan en CI/CD

**Problema:** Tests pasan localmente pero fallan en GitHub Actions

**Causas comunes:**
- Diferentes versiones de Node.js
- Dependencias no instaladas correctamente
- Path absolutos en tests

**Solución:**
```bash
# Simular CI localmente
rm -rf node_modules
npm ci          # Instala versiones exactas de package-lock.json
npm run test:run
```

---

### Docker build falla

```
ERROR: buildx failed with: ERROR: failed to solve with frontend dockerfile.v0
```

**Solución:**
```bash
# Verificar Docker está corriendo
docker ps

# Verificar sintaxis del Dockerfile
docker build -t next-steps:test .

# Verificar permisos
sudo usermod -aG docker $USER
newgrp docker
```

---

### Build lento en Docker

**Optimizaciones:**

1. **Cache de capas:** Docker cachea automáticamente
2. **Build local antes:**
   ```bash
   docker build --no-cache -t next-steps:latest .
   ```
3. **Simplificar Dockerfile:** Copiar menos archivos en etapa builder

---

### Variables de entorno no disponibles en frontend

**Problema:** Variable accesible en backend pero no en navegador

**Solución:** Agregar prefijo `NEXT_PUBLIC_`
```env
# ❌ No accesible en frontend
API_SECRET=xyz

# ✅ Accesible en frontend
NEXT_PUBLIC_API_URL=xyz
```

---

### Workflow no se ejecuta

**Checklist:**
- ¿El workflow está activado? (no deshabilitado)
- ¿El evento trigger es correcto?
  - PRs: `on: [pull_request]`
  - Merge: `on: push: branches: [main]`
- ¿El archivo está en `.github/workflows/`?
- ¿Está validado el YAML?

**Validar YAML:**
```bash
# Usar validador online
# o instalar localmente
npm install -g yaml-lint
yaml-lint .github/workflows/build.yml
```

---

### GitHub Actions sin permisos

**Error:** "Resource not accessible"

**Solución:**
1. Repo → Settings → Actions → General
2. Workflow permissions
3. Seleccionar "Read and write permissions"
4. Check "Allow GitHub Actions to create and approve PRs"

---

## Próximos Pasos

### Mejoras Recomendadas

1. **Coverage de Tests**
   ```bash
   npm run test:run -- --coverage
   ```

2. **Performance Monitoring**
   - Agregar Sentry o LogRocket

3. **Staging Environment**
   - Rama `staging` con auto-deploy

4. **Security Scanning**
   - GitHub Security tab
   - Dependabot para updates automáticos

---

## Recursos Útiles

- [Next.js Documentation](https://nextjs.org/docs)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Vitest Documentation](https://vitest.dev)
- [Tailwind CSS](https://tailwindcss.com)

---

## Licencia

Proyecto educativo de UAP - Programación IV

---

**¿Preguntas o problemas?** Abre un issue en GitHub o contacta al equipo de desarrollo.
