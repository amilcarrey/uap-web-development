URL de la aplicación deployada: [(https://book-discovery.vercel.app/)]

Repositorio GitHub: [(https://github.com/ArielS92/BookDiscovery)]

Documentación: Incluida en el README.md :
# BookDiscovery - Plataforma de Descubrimiento y Reseñas de Libros

Una aplicación web para descubrir libros, leer reseñas y compartir tus propias opiniones.

## 🚀 Características

- Búsqueda de libros usando Google Books API
- Sistema de reseñas con calificación por estrellas
- Votación comunitaria de reseñas
- Interfaz responsive con Tailwind CSS
- TypeScript para type safety
- Tests unitarios con Vitest

## 🛠️ Desarrollo

### Prerrequisitos

- Node.js 18+ 
- npm o yarn

### Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>

## 🐳 Docker Deployment

### Construir la imagen localmente

```bash
# Build de la imagen
npm run docker:build

# Ejecutar el contenedor
npm run docker:run

# Usar docker-compose
npm run docker:compose