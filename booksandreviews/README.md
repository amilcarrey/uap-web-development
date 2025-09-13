# 📚 Books & Reviews

Una plataforma moderna para descubrir libros y compartir reseñas, construida con Next.js 15, TypeScript y Tailwind CSS.

## 🌐 Deployd

**[https://booksandreviews.vercel.app/](https://booksandreviews.vercel.app/)**

## 🚀 Características

- **Búsqueda de libros** usando la API de Google Books
- **Sistema de reseñas** con calificaciones y comentarios
- **Interfaz moderna** con diseño responsive
- **Toast notifications** para mejor UX
- **Tests completos** con Vitest y Testing Library
- **CI/CD pipeline** con GitHub Actions
- **Deploy automático** en Vercel
- **Containerización** con Docker

## 🛠️ Tecnologías

- **Frontend:** Next.js 15, React 19, TypeScript
- **Styling:** Tailwind CSS
- **Testing:** Vitest, Testing Library
- **Deployment:** Vercel
- **CI/CD:** GitHub Actions
- **Container:** Docker
- **API:** Google Books API

## 📦 Instalación Local

### Prerrequisitos
- Node.js 18+
- npm o yarn

### Pasos
```bash
# Clonar y instalar
git clone https://github.com/tu-usuario/books-and-reviews.git
cd books-and-reviews
npm install

# Ejecutar en desarrollo
npm run dev
```

### Scripts Disponibles
```bash
npm run dev          # Desarrollo
npm run build        # Build para producción
npm run test:run     # Ejecutar tests
npm run test:coverage # Tests con cobertura
npm run lint         # Linting
```

## 🐳 Docker

```bash
# Construir y ejecutar localmente
docker build -t books-and-reviews .
docker run -p 3000:3000 books-and-reviews

# Usar imagen desde GitHub Container Registry
docker pull ghcr.io/tu-usuario/books-and-reviews:latest
docker run -p 3000:3000 ghcr.io/tu-usuario/books-and-reviews:latest
```

## 🔄 CI/CD Pipeline

El proyecto incluye tres workflows de GitHub Actions:

1. **Build en Pull Requests** - Verifica que el build sea exitoso
2. **Tests en Pull Requests** - Ejecuta tests unitarios y genera cobertura
3. **Docker Build y Publish** - Construye y publica imagen Docker en GHCR

## 🧪 Testing

- **115 tests** cubriendo toda la funcionalidad
- **Cobertura completa** de componentes principales
- **Tests de integración** para Server Actions

```bash
npm run test:run        # Ejecutar todos los tests
npm run test:coverage   # Tests con reporte de cobertura
```

## 📁 Estructura del Proyecto

```
├── app/                    # App Router de Next.js 15
│   ├── actions/           # Server Actions
│   ├── api/              # API Routes
│   ├── components/       # Componentes React
│   └── page.tsx          # Página principal
├── src/__tests__/        # Tests unitarios
├── .github/workflows/    # GitHub Actions
├── Dockerfile            # Configuración Docker
└── package.json          # Dependencias y scripts
```

