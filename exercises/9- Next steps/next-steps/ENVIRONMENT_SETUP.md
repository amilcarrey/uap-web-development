# ⚙️ Guía de Configuración - Variables de Entorno y Setup

Este documento detalla todas las variables de entorno necesarias para ejecutar el proyecto en diferentes ambientes.

## Índice

1. [Variables de Entorno](#variables-de-entorno)
2. [Setup Desarrollo Local](#setup-desarrollo-local)
3. [Setup Producción](#setup-producción)
4. [Setup Docker](#setup-docker)
5. [Setup GitHub Actions](#setup-github-actions)
6. [Verificación de Setup](#verificación-de-setup)

---

## Variables de Entorno

### Tipos de Variables

#### 1. Públicas (NEXT_PUBLIC_*)

Accesibles desde el navegador y en el servidor.

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_NAME=BookReviews
NEXT_PUBLIC_APP_VERSION=0.1.0
NEXT_PUBLIC_ENVIRONMENT=development
```

**Visibility:**
```typescript
// ✅ Funciona en cliente
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// ✅ Funciona en servidor
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

**Compilación:**
- Se embeben en el bundle de JavaScript
- Cualquiera puede verlas (DevTools → Network)
- Nunca guardes secrets aquí

---

#### 2. Privadas (Sin NEXT_PUBLIC_)

Solo accesibles en el servidor (server-side code y server actions).

```env
DATABASE_URL=postgresql://user:pass@localhost/db
SECRET_KEY=abc123...xyz789
API_KEY=sk-or-v1-xxxxx
```

**Visibility:**
```typescript
// ❌ ERROR en cliente
const secret = process.env.SECRET_KEY;  // undefined

// ✅ OK en servidor/server action
const secret = process.env.SECRET_KEY;  // funciona

// ✅ OK en página SSR
export default function Page() {
  const secret = process.env.SECRET_KEY;  // funciona
}
```

**Seguridad:**
- No se envían al navegador
- Solo accesibles en ejecución del servidor
- Ideales para keys y credentials

---

### Variables por Ambiente

#### `.env.local` (Desarrollo)

```env
# Aplicación
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_NAME=BookReviews
NEXT_PUBLIC_APP_VERSION=0.1.0
NEXT_PUBLIC_ENVIRONMENT=development

# Backend
DATABASE_URL=file:./data.db
SECRET_KEY=dev-key-insecure-only-for-dev
NODE_ENV=development
```

**Cuándo se usa:**
- Desarrollo local con `npm run dev`
- Tests locales
- Machine personal

**Nota:** Git lo ignora (`package.json` tiene en `.gitignore`)

---

#### `.env.production` (Producción)

```env
# Aplicación
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_APP_NAME=BookReviews
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_ENVIRONMENT=production

# Backend
DATABASE_URL=postgresql://user:securepass@prod-db.host/bookdb
SECRET_KEY=prod-random-secure-key-generate-with-openssl
NODE_ENV=production
```

**Cuándo se usa:**
- Despliegue en Vercel
- Despliegue en servidor propio
- Imágenes Docker para producción

---

#### `.env.test` (Tests)

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
DATABASE_URL=:memory:
SECRET_KEY=test-key
NODE_ENV=test
```

**Cuándo se usa:**
- Ejecutar `npm run test`
- CI/CD en GitHub Actions

---

### Tabla de Referencia

| Variable | Ambiente | Público | Requerido | Ejemplo |
|----------|----------|---------|-----------|---------|
| `NEXT_PUBLIC_API_URL` | Todos | ✅ | Sí | `https://api.example.com` |
| `NEXT_PUBLIC_APP_NAME` | Todos | ✅ | No | `BookReviews` |
| `NEXT_PUBLIC_ENVIRONMENT` | Todos | ✅ | No | `production` |
| `DATABASE_URL` | Prod/Test | ❌ | Sí | `postgresql://...` |
| `SECRET_KEY` | Prod | ❌ | Sí | Generar con `openssl` |
| `NODE_ENV` | Todos | ❌ | Sí | `development`, `production` |

---

## Setup Desarrollo Local

### Paso 1: Crear `.env.local`

En la raíz del proyecto (`next-steps/`):

```bash
cat > .env.local << 'EOF'
# Desarrollo Local
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_NAME=BookReviews
NEXT_PUBLIC_APP_VERSION=0.1.0
NEXT_PUBLIC_ENVIRONMENT=development

# Base de datos (local)
DATABASE_URL=file:./data.db

# Seguridad (insegura, solo dev)
SECRET_KEY=dev-insecure-change-in-production

# Node
NODE_ENV=development
EOF
```

**Resultado:**
```
next-steps/
├── .env.local          ← Creado
├── src/
├── package.json
└── ...
```

---

### Paso 2: Verificar Variables

```bash
# Ver contenido
cat .env.local

# Verificar que Next.js las carga
npm run dev
```

En los logs deberías ver:
```
✓ Ready - ready on http://localhost:3000
```

---

### Paso 3: Acceder en la App

**En componente del servidor:**
```typescript
// app/page.tsx
export default function Page() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const secret = process.env.SECRET_KEY;  // Privada
  
  return <div>{apiUrl}</div>;
}
```

**En cliente:**
```typescript
// app/components/MyComponent.tsx
'use client';

export default function MyComponent() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;  // ✅ OK
  const secret = process.env.SECRET_KEY;  // ❌ undefined
  
  return <div>{apiUrl}</div>;
}
```

---

### Paso 4: Verificar Setup

```bash
# Instalar dependencias
npm install

# Ejecutar dev
npm run dev

# Abrir navegador
curl http://localhost:3000
```

Debería funcionar sin errores de variables faltantes.

---

## Setup Producción

### Opción 1: Vercel (Recomendado)

**En Vercel Dashboard:**

1. Ir a tu proyecto
2. Settings → Environment Variables
3. Agregar variables:

| Name | Value | Type |
|------|-------|------|
| `NEXT_PUBLIC_API_URL` | `https://api.example.com` | Public |
| `DATABASE_URL` | `postgresql://...` | Encrypted |
| `SECRET_KEY` | (generar con openssl) | Encrypted |
| `NODE_ENV` | `production` | Public |

**Generar SECRET_KEY seguro:**
```bash
openssl rand -base64 32
# Salida: aBc1DeF2GhIjKlMnOpQrStUvWxYz0123456789+/=
```

**Deploy:**
```bash
git push
# Vercel detecta push → Deplyar automáticamente
# Variables se cargan automáticamente
```

---

### Opción 2: Servidor Propio

#### Crear `.env.production`

```bash
cat > .env.production << 'EOF'
NEXT_PUBLIC_API_URL=https://bookreviews.example.com/api
NEXT_PUBLIC_APP_NAME=BookReviews
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_ENVIRONMENT=production

DATABASE_URL=postgresql://user:password@postgres.example.com/bookdb
SECRET_KEY=$(openssl rand -base64 32)
NODE_ENV=production
EOF
```

#### Build para Producción

```bash
# Limpiar
rm -rf .next node_modules

# Instalar exactamente (production)
npm ci --only=production

# Build
npm run build

# Verificar
npm start
```

#### PM2 para Mantener Proceso Activo

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Crear aplicación
pm2 start npm --name "next-app" -- start

# Guardar startup
pm2 startup
pm2 save

# Monitorear
pm2 monit
pm2 logs
```

---

### Opción 3: Railway.app

**En Railway Dashboard:**

1. New Project
2. Conectar repositorio GitHub
3. Variables (por rama):

```
NEXT_PUBLIC_API_URL=https://bookreviews-prod.railway.app/api
DATABASE_URL=postgresql://...
SECRET_KEY=...
NODE_ENV=production
```

4. Deploy automático

---

## Setup Docker

### Para Desarrollo

Crear `.env.local`:
```bash
docker build -t next-steps:dev .
docker run -p 3000:3000 \
  --env-file .env.local \
  next-steps:dev
```

### Para Producción

Crear `.env.production`:
```bash
docker build -t next-steps:1.0.0 .

# Pasar variables al runtime
docker run -d \
  -p 3000:3000 \
  --name bookreviews-app \
  --env-file .env.production \
  next-steps:1.0.0
```

### En Docker Compose

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env.production
    environment:
      NODE_ENV: production
    restart: unless-stopped
    
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

**Ejecutar:**
```bash
docker-compose up -d
docker-compose logs -f app
```

---

## Setup GitHub Actions

### Secrets en GitHub

Los workflows necesitan acceso a variables sensibles.

**Agregar Secrets:**

1. Repo → Settings → Secrets and variables → Actions
2. New repository secret

| Nombre | Valor | Uso |
|--------|-------|-----|
| `DOCKER_REGISTRY_PASSWORD` | Token de registro | Docker push |

**En GitHub Actions (no lo hagas):**
```yaml
# ❌ NUNCA hacer esto
env:
  SECRET: abc123
```

Se vería en los logs públicamente.

**Hacer correctamente:**
```yaml
# ✅ Usar secrets
- name: Deploy
  env:
    SECRET: ${{ secrets.MY_SECRET }}
  run: ./deploy.sh
```

---

### Workflow con Variables

**`.github/workflows/docker.yml`:**
```yaml
env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
```

---

## Verificación de Setup

### Checklist de Verificación

```bash
# 1. ¿Archivo .env existe?
[ -f .env.local ] && echo "✅ .env.local existe" || echo "❌ .env.local falta"

# 2. ¿Tiene variables?
grep NEXT_PUBLIC_API_URL .env.local && echo "✅ Variables OK" || echo "❌ Variables falta"

# 3. ¿npm instala sin errores?
npm ci > /dev/null 2>&1 && echo "✅ npm OK" || echo "❌ npm error"

# 4. ¿Build se compila?
npm run build > /dev/null 2>&1 && echo "✅ Build OK" || echo "❌ Build error"

# 5. ¿Tests pasan?
npm run test:run > /dev/null 2>&1 && echo "✅ Tests OK" || echo "❌ Tests fallan"

# 6. ¿Dev server inicia?
timeout 5 npm run dev > /dev/null 2>&1 && echo "✅ Dev OK" || echo "❌ Dev error"
```

---

### Script de Verificación

Crear `verify-env.sh`:

```bash
#!/bin/bash

echo "🔍 Verificando setup..."
echo ""

# Check .env.local
if [ ! -f .env.local ]; then
    echo "❌ .env.local no existe"
    echo "💡 Copia .env.example o crea manualmente"
    exit 1
fi

echo "✅ .env.local existe"

# Check variables críticas
REQUIRED_VARS=(
    "NEXT_PUBLIC_API_URL"
    "NODE_ENV"
)

for var in "${REQUIRED_VARS[@]}"; do
    if grep -q "^$var=" .env.local; then
        echo "✅ $var está configurado"
    else
        echo "❌ $var falta en .env.local"
        exit 1
    fi
done

echo ""
echo "✅ Setup verificado correctamente!"
echo ""
echo "Próximos pasos:"
echo "  npm install"
echo "  npm run dev"
```

Ejecutar:
```bash
chmod +x verify-env.sh
./verify-env.sh
```

---

### Health Check del Servidor

```bash
# Cuando server está corriendo
curl http://localhost:3000
# Debería retornar HTML (status 200)

# Verificar variables cargadas
curl http://localhost:3000/api/config
# Debería retornar config pública
```

---

## Troubleshooting

### Error: Variables no se cargan

```
Error: NEXT_PUBLIC_API_URL is undefined
```

**Causas:**
1. ❌ Archivo `.env.local` no existe
2. ❌ Variable escrita mal (mayúsculas/minúsculas)
3. ❌ Formato incorrecto (espacios alrededor del `=`)

**Solución:**
```bash
# Verificar archivo existe
ls -la .env.local

# Ver contenido exacto
cat .env.local

# Verifica que sea NEXT_PUBLIC_API_URL, no Next_Public_Api_Url
```

---

### Error: "Cannot find module 'SECRET_KEY'"

```
Error: process.env.SECRET_KEY is not a module
```

**Problema:** Intentando importar variable como módulo

**Solución:**
```typescript
// ❌ Mal
import { SECRET_KEY } from process.env;

// ✅ Bien
const secret = process.env.SECRET_KEY;
```

---

### Error: Variable visible en cliente

```
Problema: process.env.DATABASE_URL muestra valor en navegador
```

**Causa:** Variable privada accedida desde cliente

**Solución:**
```typescript
// ❌ Expone variable
export async function getConfig() {
  return { db: process.env.DATABASE_URL };  // ¡Visible!
}

// ✅ Privada
export async function query() {
  const db = process.env.DATABASE_URL;
  // ... solo en servidor
  return result;
}
```

---

### Error: Docker no tiene variables

```
Error: Cannot connect to API - NEXT_PUBLIC_API_URL is undefined
```

**Solución:**
```bash
# Pasar variables al contenedor
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://api.example.com \
  -e DATABASE_URL=postgresql://... \
  next-steps:latest
```

O con archivo:
```bash
docker run -p 3000:3000 \
  --env-file .env.production \
  next-steps:latest
```

---

## Resumen

| Tarea | Comando |
|-------|---------|
| Crear `.env.local` | `cp .env.example .env.local` |
| Verificar setup | `npm run build` |
| Generar secret | `openssl rand -base64 32` |
| Ver variables | `cat .env.local` |
| Verificación completa | `./verify-env.sh` |

**Key Takeaway:** Variables de entorno = Configuración sin hardcodear valores ✅

---
