# 📚 Libros y Review

Aplicación web para buscar libros y escribir reseñas, construida con Next.js 15, React 19 y TypeScript.

## 🌐 URL de la Aplicación Deployada

**URL de Producción:** [https://y-miesddzsk-patohes-projects.vercel.app](https://y-miesddzsk-patohes-projects.vercel.app)

> **Estado:** ✅ Aplicación desplegada y funcionando correctamente en Vercel

## 📋 Entregables del Proyecto

### ✅ 1. URL de la Aplicación Desplegada
- **Producción:** [https://y-miesddzsk-patohes-projects.vercel.app](https://y-miesddzsk-patohes-projects.vercel.app)
- **Estado:** Activa y funcionando
- **Plataforma:** Vercel

### ✅ 2. Repositorio de GitHub
- **Código fuente completo** con toda la implementación
- **Workflows de GitHub Actions** configurados y funcionando
- **Dockerfile** para containerización
- **Tests unitarios** implementados

### ✅ 3. Documentación Completa
- **Deploy local:** Instrucciones paso a paso
- **GitHub Actions:** Explicación detallada del pipeline CI/CD
- **Variables de entorno:** Configuración completa
- **Docker:** Instrucciones para ejecución local y en contenedor

### ✅ 4. Demostración de GitHub Actions
- **Pipeline CI/CD funcionando:** Como evidencia los deployments exitosos en Vercel
- **Builds automáticos:** Cada push activa el workflow
- **Docker Registry:** Imágenes publicadas automáticamente en GitHub Container Registry

## 🚀 Deploy Local

### Prerrequisitos
- Node.js 18 o superior
- npm (incluido con Node.js)

### Pasos para ejecutar localmente

1. **Clonar el repositorio:**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd librosyreview
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador:**
   - Visita [http://localhost:3000](http://localhost:3000)

### Scripts disponibles

- `npm run dev` - Ejecutar en modo desarrollo con Turbopack
- `npm run build` - Construir para producción
- `npm run start` - Ejecutar versión de producción
- `npm run test` - Ejecutar tests con Vitest
- `npm run test:coverage` - Ejecutar tests con reporte de cobertura
- `npm run lint` - Verificar código con ESLint
- `npm run lint:fix` - Corregir automáticamente errores de ESLint

## 🔧 GitHub Actions - CI/CD Pipeline

### Cómo funcionan los GitHub Actions

El proyecto utiliza un pipeline de CI/CD automatizado que se ejecuta en dos jobs principales:

#### **Job 1: test-and-deploy**
1. **Checkout del código** - Descarga el código del repositorio
2. **Setup de Node.js 18** - Configura el entorno de Node.js con caché de npm
3. **Instalación de dependencias** - Ejecuta `npm ci` para instalar dependencias
4. **Ejecución de tests** - Ejecuta todos los tests unitarios con Vitest
5. **Build de la aplicación** - Construye la aplicación para producción
6. **Deploy a Vercel** - Despliega automáticamente a Vercel en producción

#### **Job 2: docker-build-and-push**
1. **Checkout del código** - Descarga el código del repositorio
2. **Setup de Docker Buildx** - Configura Docker para builds avanzados
3. **Login a GitHub Container Registry** - Se autentica en ghcr.io
4. **Extracción de metadatos** - Genera tags automáticos para la imagen
5. **Build y Push de imagen Docker** - Construye y publica la imagen Docker

### Triggers del Workflow

- **Push** a las ramas: `main`, `master`, `libros`
- **Pull Request** a las ramas: `main`, `master`, `libros`

### Tags de Docker generados automáticamente

- `latest` - Para la rama principal
- `<branch-name>` - Nombre de la rama
- `<branch>-<commit-hash>` - Rama con hash del commit
- `<YYYYMMDD-HHmmss>` - Timestamp del build

## 🔐 Variables de Entorno Necesarias

### Para GitHub Actions (GitHub Secrets)

Configura estos secretos en tu repositorio de GitHub (`Settings > Secrets and variables > Actions`):

#### **Vercel Deploy:**
- `VERCEL_TOKEN` - Token de API de Vercel
- `VERCEL_ORG_ID` - ID de la organización de Vercel
- `VERCEL_PROJECT_ID` - ID del proyecto de Vercel

#### **Docker Registry:**
- `GITHUB_TOKEN` - Se genera automáticamente (no requiere configuración)

### Cómo obtener las variables de Vercel

1. **VERCEL_TOKEN:**
   - Ve a [Vercel Dashboard](https://vercel.com/account/tokens)
   - Crea un nuevo token
   - Copia el token (sin caracteres adicionales como '=')

2. **VERCEL_ORG_ID y VERCEL_PROJECT_ID:**
   - Ejecuta en tu proyecto local:
     ```bash
     npx vercel link
     ```
   - Los IDs se guardarán en `.vercel/project.json`

### Para desarrollo local

No se requieren variables de entorno adicionales para el desarrollo local. La aplicación funciona completamente sin configuración externa.

## 🐳 Instrucciones para ejecutar con Docker

### Prerrequisitos
- Docker Desktop instalado y ejecutándose
- Git (para clonar el repositorio)

### Opción 1: Usar imagen pre-construida desde GitHub Container Registry

```bash
# Descargar la imagen más reciente
docker pull ghcr.io/<USUARIO>/<REPOSITORIO>:latest

# Ejecutar el contenedor
docker run -p 3000:3000 ghcr.io/<USUARIO>/<REPOSITORIO>:latest
```

### Opción 2: Construir imagen localmente

1. **Clonar el repositorio:**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd librosyreview
   ```

2. **Construir la imagen Docker:**
   ```bash
   docker build -t librosyreview-local .
   ```

3. **Ejecutar el contenedor:**
   ```bash
   docker run -p 3000:3000 librosyreview-local
   ```

4. **Acceder a la aplicación:**
   - Visita [http://localhost:3000](http://localhost:3000)

### Comandos útiles de Docker

```bash
# Ejecutar en segundo plano
docker run -d -p 3000:3000 --name librosyreview librosyreview-local

# Ver contenedores ejecutándose
docker ps

# Ver logs del contenedor
docker logs librosyreview

# Detener el contenedor
docker stop librosyreview

# Eliminar el contenedor
docker rm librosyreview

# Ver imágenes disponibles
docker images
```

### Características del Dockerfile

- **Multi-stage build** para optimizar el tamaño de la imagen
- **Imagen base Alpine Linux** para mayor seguridad y menor tamaño
- **Usuario no-root** para mayor seguridad
- **Optimización de caché** de dependencias
- **Build standalone** de Next.js para mejor rendimiento

## 🧪 Testing

### Ejecutar tests

```bash
# Tests en modo watch
npm run test

# Tests una sola vez
npm run test:run

# Tests con cobertura
npm run test:coverage

# Tests con interfaz visual
npm run test:ui
```

### Cobertura de tests

El proyecto incluye tests unitarios para:
- Componentes React (BookCard, BookModal, ReviewsSection)
- Funciones utilitarias (books.ts)
- Integración con localStorage
- Manejo de errores de API

## 📁 Estructura del Proyecto
