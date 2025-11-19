# 📚 AI Book Advisor - Asistente Inteligente de Recomendación de Libros

## 📋 Descripción del Proyecto

**AI Book Advisor** es un asistente conversacional inteligente que ayuda a los usuarios a descubrir libros, gestionar listas de lectura personalizadas y obtener estadísticas de sus hábitos de lectura. Utiliza **Inteligencia Artificial** con sistema de **Tool Calling** para ejecutar herramientas automáticamente según el contexto de la conversación.

### ✨ Características Principales

- 🤖 **Chat Conversacional con IA**: Interfaz moderna donde puedes pedir recomendaciones naturalmente
- 🔧 **Sistema de Tool Calling**: El LLM ejecuta automáticamente 6 herramientas según tus necesidades
- 📖 **Integración con Google Books API**: Búsqueda de libros reales con información completa
- 📝 **Gestión de Listas de Lectura**: Guarda libros para leer después con prioridades y notas
- ⭐ **Marcado de Libros Leídos**: Agrega ratings y reviews personales
- 📊 **Estadísticas de Lectura**: Analytics de tus hábitos (libros leídos, géneros favoritos, rachas, etc.)
- 💾 **Caché Inteligente**: Reduce llamadas a APIs externas guardando información de libros
- 🔒 **Seguridad Implementada**: Rate limiting, sanitización de inputs, validación con Zod

---

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|------------|-----|
| **Next.js 15+** | Framework principal con App Router |
| **Vercel AI SDK** | Streaming de respuestas LLM y tool calling |
| **OpenRouter** | Proveedor de LLM (Claude/GPT) |
| **Google Books API** | Búsqueda y detalles de libros |
| **Prisma** | ORM para base de datos |
| **SQLite** | Base de datos local |
| **TypeScript** | Tipado estático |
| **Tailwind CSS** | Estilos |
| **Zod** | Validación de schemas |
| **sanitize-html** | Sanitización de inputs |

---

## 📁 Arquitectura del Proyecto

```
ChatBot/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/
│   │   │   │   └── route.ts          # Endpoint principal del chat (OpenRouter)
│   │   │   └── tools/                # Endpoints individuales de cada tool
│   │   │       ├── searchBooks/
│   │   │       ├── getBookDetails/
│   │   │       ├── addToReadingList/
│   │   │       ├── getReadingList/
│   │   │       ├── markAsRead/
│   │   │       └── getReadingStats/
│   │   ├── components/
│   │   │   └── StatsPanel.tsx        # Panel de estadísticas (lado izquierdo)
│   │   ├── page.tsx                  # Página principal del chat
│   │   └── globals.css
│   └── lib/
│       ├── tools.ts                  # Definición de las 6 tools para el LLM
│       ├── searchBooks.ts            # Lógica de búsqueda en Google Books
│       ├── getBookDetails.ts         # Detalles de libro (con caché)
│       ├── addToReadingList.ts       # Agregar a lista de lectura
│       ├── getReadingList.ts         # Obtener lista de lectura
│       ├── markAsRead.ts             # Marcar como leído
│       ├── getReadingStats.ts        # Generar estadísticas
│       ├── prisma.ts                 # Cliente de Prisma
│       ├── rateLimitPersistent.ts    # Rate limiting con persistencia
│       ├── sanitize.ts               # Sanitización de inputs
│       └── schema.ts                 # Schemas de validación con Zod
├── prisma/
│   ├── schema.prisma                 # Schema de base de datos
│   └── migrations/                   # Migraciones de base de datos
├── .env                              # Variables de entorno (NO commitear)
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Instalación y Configuración

### 1️⃣ Requisitos Previos

- **Node.js** 18+ y **npm** instalados
- Cuenta en [OpenRouter](https://openrouter.ai/) (para obtener API key del LLM)
- API Key de [Google Books API](https://developers.google.com/books/docs/v1/getting_started)

### 2️⃣ Clonar e Instalar Dependencias

```bash
# Clonar el repositorio
git clone <tu-repo>
cd ChatBot

# Instalar dependencias
npm install
```

### 3️⃣ Configurar Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
# ========================================
# VARIABLES DE ENTORNO - AI BOOK ADVISOR
# ========================================

# 🔑 OpenRouter (LLM Provider)
# Obtén tu API key en: https://openrouter.ai/keys
OPENROUTER_API_KEY=sk-or-v1-tu-api-key-aqui
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

# Modelo LLM a utilizar (opciones gratuitas/económicas):
# - anthropic/claude-3-haiku (recomendado, barato y rápido)
# - openai/gpt-3.5-turbo
# - meta-llama/llama-3.1-8b-instruct:free (gratis)
OPENROUTER_MODEL=anthropic/claude-3-haiku

# 📚 Google Books API
# Obtén tu API key en: https://console.cloud.google.com/apis/credentials
# Tutorial: https://developers.google.com/books/docs/v1/getting_started
GOOGLE_BOOKS_API_KEY=tu-google-books-api-key-aqui

# 💾 Base de Datos (SQLite)
# Para desarrollo local con SQLite (archivo local)
DATABASE_URL="file:./dev.db"

# Para producción con PostgreSQL (ejemplo):
# DATABASE_URL="postgresql://usuario:password@localhost:5432/bookadvisor"

# ⚙️ Configuración Opcional de Rate Limiting
RATE_LIMIT_MAX_REQUESTS=60
RATE_LIMIT_WINDOW_MS=3600000
```

### 4️⃣ Configurar la Base de Datos

```bash
# Aplicar migraciones
npx prisma migrate dev

# (Opcional) Abrir Prisma Studio para ver la base de datos
npx prisma studio
```

### 5️⃣ Ejecutar el Proyecto

```bash
# Modo desarrollo
npm run dev

# Modo producción
npm run build
npm start
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🔧 Sistema de Tool Calling (6 Herramientas)

El LLM tiene acceso a 6 herramientas que ejecuta automáticamente según el contexto:

### 1. **searchBooks**
**Descripción:** Buscar libros en Google Books por título, autor o tema.

**Ejemplo de uso:**
```
Usuario: "Recomiéndame libros sobre inteligencia artificial"
AI: [Ejecuta searchBooks] → Muestra lista de libros relevantes
```

**Parámetros:**
- `query`: String de búsqueda
- `maxResults`: Número de resultados (default: 10)
- `orderBy`: `relevance` o `newest`

---

### 2. **getBookDetails**
**Descripción:** Obtener información detallada de un libro específico.

**Ejemplo de uso:**
```
Usuario: "Cuéntame más sobre Dune"
AI: [Ejecuta getBookDetails] → Descripción completa, páginas, rating, etc.
```

**Parámetros:**
- `bookId`: ID único de Google Books

**💾 Caché:** Esta herramienta usa caché inteligente. Si un libro ya fue consultado hace menos de 7 días, NO hace llamada a Google Books API.

---

### 3. **addToReadingList**
**Descripción:** Agregar un libro a tu lista "Quiero Leer".

**Ejemplo de uso:**
```
Usuario: "Agrega ese libro a mi lista"
AI: [Ejecuta addToReadingList] → Confirma que fue agregado
```

**Parámetros:**
- `bookId`: ID del libro
- `priority`: `low`, `medium`, `high` (opcional)
- `notes`: Notas personales (opcional)

---

### 4. **getReadingList**
**Descripción:** Ver tu lista de libros pendientes.

**Ejemplo de uso:**
```
Usuario: "¿Qué libros tengo en mi lista?"
AI: [Ejecuta getReadingList] → Muestra libros con prioridades y fechas
```

**Parámetros:**
- `limit`: Número máximo de resultados (default: 10)
- `order`: `asc` o `desc` por fecha

---

### 5. **markAsRead**
**Descripción:** Marcar un libro como leído, con rating/review opcional.

**Ejemplo de uso:**
```
Usuario: "Ya terminé 1984, me encantó, 5 estrellas"
AI: [Ejecuta markAsRead] → Confirma y actualiza estadísticas
```

**Parámetros:**
- `bookId`: ID del libro
- `rating`: 1-5 estrellas (opcional)
- `review`: Review personal (opcional)
- `dateFinished`: Fecha de finalización (default: hoy)

---

### 6. **getReadingStats**
**Descripción:** Generar estadísticas de tus hábitos de lectura.

**Ejemplo de uso:**
```
Usuario: "Muéstrame mis estadísticas"
AI: [Ejecuta getReadingStats] → Total de libros, géneros favoritos, racha, etc.
```

**Parámetros:**
- `period`: `all-time`, `year`, `month`, `week`

**Estadísticas incluidas:**
- 📚 Total de libros leídos
- 📖 Páginas totales
- ⭐ Rating promedio
- 🎯 Género favorito
- ✍️ Autor favorito
- 📅 Libros este mes
- 🔥 Racha de lectura actual

---

## 🗄️ Estructura de Base de Datos

### **Modelo `ReadingList`** (Lista de lectura)
```prisma
model ReadingList {
  id        String   @id @default(cuid())
  userId    String
  bookId    String
  priority  String?   // low, medium, high
  notes     String?
  addedAt   DateTime @default(now())

  @@index([userId])
  @@index([bookId])
  @@unique([userId, bookId])  // Evita duplicados
}
```

### **Modelo `ReadBook`** (Libros leídos)
```prisma
model ReadBook {
  id           String   @id @default(cuid())
  userId       String
  bookId       String
  rating       Int?      // 1-5 estrellas
  review       String?
  dateFinished DateTime @default(now())

  @@index([userId])
  @@index([bookId])
  @@index([dateFinished])
}
```

### **Modelo `BookCache`** (Caché de Google Books API)
```prisma
model BookCache {
  id            String   @id @default(cuid())
  bookId        String   @unique
  title         String
  authors       String   // JSON string
  description   String?
  pageCount     Int
  categories    String?  // JSON string
  publishedDate String?
  rating        Float?
  ratingsCount  Int
  thumbnail     String?
  cachedAt      DateTime @default(now())

  @@index([bookId])
}
```

**Ventajas del caché:**
- ✅ Reduce llamadas a Google Books API
- ✅ Mejora velocidad de respuesta
- ✅ Reduce costos si usas API con límites
- ✅ Caché expira automáticamente después de 7 días

---

## 🔒 Seguridad Implementada

### ✅ Medidas de Seguridad

1. **API Keys solo en Backend**
   - Todas las llamadas a OpenRouter y Google Books se hacen desde API routes
   - Las keys NUNCA se exponen al frontend

2. **Variables de Entorno**
   - Almacenadas en `.env` (sin prefijo `NEXT_PUBLIC_`)
   - Archivo `.env` incluido en `.gitignore`

3. **Sanitización de Inputs**
   - Todos los mensajes del usuario se sanitizan con `sanitize-html`
   - Previene inyección de HTML/scripts maliciosos

4. **Validación con Zod**
   - Todos los requests se validan con schemas estrictos
   - Rechaza datos inválidos antes de procesarlos

5. **Rate Limiting**
   - Límite de 60 requests por hora por IP
   - Implementado con persistencia en archivo JSON
   - En producción, usar Redis/Vercel KV

6. **Protección SQL Injection**
   - Uso de Prisma ORM (queries parametrizadas automáticamente)
   - No hay queries SQL raw

---

## 📊 Panel de Estadísticas

El proyecto incluye un **Panel de Estadísticas Interactivo** (`StatsPanel.tsx`) que se actualiza automáticamente cada 30 segundos.

**Muestra:**
- 📚 Total de libros leídos
- 📖 Páginas totales leídas
- ⭐ Rating promedio de tus libros
- 🎯 Género favorito
- ✍️ Autor favorito
- 📅 Libros leídos este mes
- 🔥 Racha de lectura actual
- 🏆 Desafíos sugeridos

---

## 🧪 Cómo Probar el Proyecto

### Flujo de Ejemplo:

1. **Buscar libros:**
   ```
   "Recomiéndame libros sobre ciencia ficción"
   ```

2. **Ver detalles:**
   ```
   "Cuéntame más sobre el primer libro"
   ```

3. **Agregar a lista:**
   ```
   "Agrégalo a mi lista de lectura con prioridad alta"
   ```

4. **Ver lista:**
   ```
   "¿Qué libros tengo en mi lista?"
   ```

5. **Marcar como leído:**
   ```
   "Ya terminé de leer ese libro, le doy 4 estrellas"
   ```

6. **Ver estadísticas:**
   ```
   "Muéstrame mis estadísticas de lectura"
   ```

---

## 🐛 Troubleshooting

### Problema: "Error al conectar con OpenRouter"
**Solución:** Verifica que tu `OPENROUTER_API_KEY` sea válida en el archivo `.env`.

### Problema: "Google Books API error"
**Solución:** Asegúrate de haber habilitado la Google Books API en Google Cloud Console y que tu API key sea correcta.

### Problema: "Prisma Client error"
**Solución:** Ejecuta `npx prisma generate` para regenerar el cliente.

### Problema: Rate limit alcanzado
**Solución:** Espera 1 hora o elimina el archivo `.next/rate-limit-store.json` (solo para desarrollo).

---

## 📚 Recursos Adicionales

- [Vercel AI SDK Docs](https://sdk.vercel.ai/)
- [OpenRouter Docs](https://openrouter.ai/docs)
- [Google Books API](https://developers.google.com/books/docs/v1/using)
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)

---

## 👨‍🎓 Autor

**Trabajo Práctico - Programación IV**  
Universidad: [Tu Universidad]  
Año: 2025

---

## 📝 Licencia

Este proyecto es académico y no tiene licencia comercial.
