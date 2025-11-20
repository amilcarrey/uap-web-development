# AI Book Advisor

Un asistente conversacional para recomendaciones de lectura, construido con Next.js 15 (App Router), el AI SDK de Vercel, OpenRouter y la API de Google Books. Incluye chat con streaming, tool calling en backend, validación con Zod y persistencia en SQLite para listas, historial y estadísticas.

## ✨ Características principales
- Chat con streaming usando el AI SDK de Vercel y OpenRouter (tool calling habilitado).
- Llamadas a Google Books y OpenRouter únicamente desde el backend para proteger claves.
- Gestión de lista de lectura, historial y estadísticas persistentes en SQLite.
- Validación y sanitización de entradas con Zod.
- Rate limiting básico configurable en rutas de chat y tools.

## 🚀 Configuración rápida

1. Crea un archivo `.env.local` en la raíz del proyecto y añade tus credenciales (no commitees este archivo):
   ```bash
   OPENROUTER_API_KEY=sk-or-v1-your-api-key-here
   OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
   OPENROUTER_MODEL=anthropic/claude-3-haiku
   GOOGLE_BOOKS_API_KEY=your-google-books-api-key
   DATABASE_URL=postgresql://user:password@localhost:5432/bookadvisor
   RATE_LIMIT_MAX_REQUESTS=100
   RATE_LIMIT_WINDOW_MS=900000
   ```

2. Instala dependencias y ejecuta en modo desarrollo:
   ```bash
   npm install
   npm run dev
   ```

## 🔗 Rutas clave (Backend)
- `POST /api/chat`  
  Orquesta la conversación con OpenRouter y ejecuta tool calling en streaming.
- `GET /api/tools/[tool]`  
  Lista de tools disponibles.
- `POST /api/tools/searchBooks`  
  Busca libros en Google Books (requiere `query`).
- `POST /api/tools/getBookDetails`  
  Obtiene detalles completos por `bookId`.
- `POST /api/tools/addToReadingList`  
  Agrega un libro a la lista del usuario (header opcional `x-user-id`).
- `POST /api/tools/getReadingList`  
  Recupera la lista con filtros (`filter`, `limit`).
- `POST /api/tools/markAsRead`  
  Marca como leído con `rating`/`review` opcional.
- `POST /api/tools/getReadingStats`  
  Genera estadísticas persistidas en SQLite y filtradas por periodo.

Todas las rutas:
- Validan payloads con Zod.
- Sanitizan queries.
- Acceden a Google Books y OpenRouter solo desde el backend (no exponen keys).
- Aplican rate limiting básico en chat y tools.

## 🧩 Estructura y consideraciones
- La UI incluye: chat con streaming, panel de lista de lectura y métricas de hábitos.
- Persistencia por defecto en SQLite (puedes cambiar `DATABASE_URL` a otro motor si lo deseas).
- Tool calling totalmente implementado en el backend para mantener la seguridad de las claves.

