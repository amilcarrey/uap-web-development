# 📚 Plataforma de Reseñas de Libros

## 🎯 **Descripción del Proyecto**

Esta es una aplicación web completa para descubrir y reseñar libros. Los usuarios pueden buscar libros usando la API de Google Books, ver información detallada, escribir reseñas con calificaciones por estrellas, y votar por las reseñas más útiles.

---

## 🛠️ **Tecnologías Utilizadas**

### **Frontend**
- **Next.js 15** - Framework de React para aplicaciones web
- **React 18** - Biblioteca para interfaces de usuario
- **TypeScript** - Lenguaje tipado basado en JavaScript
- **Tailwind CSS** - Framework de CSS para estilos

### **Backend**
- **Next.js API Routes** - APIs REST integradas
- **PostgreSQL** - Base de datos relacional
- **Prisma** - ORM (Object-Relational Mapping) para manejar la base de datos

### **APIs Externas**
- **Google Books API** - Para buscar información de libros

---

## 🏗️ **Arquitectura del Proyecto**

```
src/
├── app/                    # Rutas y páginas (App Router de Next.js)
│   ├── api/               # APIs REST del backend
│   │   └── reviews/       # Endpoints para reseñas
│   ├── book/[id]/         # Página dinámica de detalles del libro
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página de inicio
├── components/            # Componentes React reutilizables
├── hooks/                 # Custom hooks de React
├── lib/                   # Utilidades y configuraciones
└── generated/             # Archivos generados por Prisma
```

---

## 📊 **Base de Datos**

### **Modelo de Datos**

La aplicación usa **3 tablas principales**:

#### **1. Books (Libros)**
Almacena información de los libros obtenida de Google Books API:
- `id` - ID único del libro (viene de Google Books)
- `title` - Título del libro
- `authors` - Array de autores
- `publisher` - Editorial
- `publishedDate` - Fecha de publicación
- `description` - Descripción del libro
- `imageUrl` - URL de la portada
- `pageCount` - Número de páginas
- `categories` - Categorías del libro

#### **2. Reviews (Reseñas)**
Almacena las reseñas escritas por usuarios:
- `id` - ID único de la reseña
- `bookId` - ID del libro al que pertenece
- `userName` - Nombre del usuario que escribió la reseña
- `rating` - Calificación de 1-5 estrellas
- `reviewText` - Texto de la reseña
- `upvotes` - Número de votos positivos
- `downvotes` - Número de votos negativos

#### **3. Votes (Votos)**
Almacena los votos de usuarios en las reseñas:
- `id` - ID único del voto
- `reviewId` - ID de la reseña votada
- `userIP` - IP del usuario (para evitar votos duplicados)
- `voteType` - Tipo de voto (UP o DOWN)

---

## 🔄 **Flujo de la Aplicación**

### **1. Búsqueda de Libros**
```
Usuario escribe término → Hook useBookSearch → API Google Books → Resultados mostrados
```

### **2. Ver Detalles del Libro**
```
Usuario hace clic en libro → Navegación a /book/[id] → API Google Books (detalles) → Página de detalles
```

### **3. Escribir Reseña**
```
Usuario completa formulario → POST /api/reviews → Guardar en PostgreSQL → Actualizar lista
```

### **4. Votar Reseña**
```
Usuario vota → POST /api/reviews/vote → Verificar voto único → Actualizar contadores
```

---

## 📁 **Explicación de Archivos Principales**

### **Componentes React**

#### **`BookSearch.tsx`**
- **Propósito**: Formulario de búsqueda de libros
- **Funciones principales**:
  - Captura texto de búsqueda del usuario
  - Detecta automáticamente si es ISBN o búsqueda normal
  - Llama al hook `useBookSearch` para realizar la búsqueda
  - Muestra los resultados usando `BookList`

#### **`BookList.tsx`**
- **Propósito**: Muestra lista de libros en formato de tarjetas
- **Funciones principales**:
  - Recibe array de libros como props
  - Muestra cada libro con imagen, título, autor, etc.
  - Hace libros clickeables para navegar a detalles
  - Maneja casos cuando no hay resultados

#### **`ReviewForm.tsx`**
- **Propósito**: Formulario para escribir reseñas
- **Funciones principales**:
  - Sistema de calificación por estrellas interactivo
  - Campos para nombre de usuario y texto de reseña
  - Validación de formulario
  - Envía datos a API `/api/reviews`

#### **`ReviewList.tsx`**
- **Propósito**: Lista todas las reseñas de un libro
- **Funciones principales**:
  - Carga reseñas desde API
  - Sistema de ordenamiento (fecha, calificación, utilidad)
  - Botones de votación (upvote/downvote)
  - Estados de carga y error

### **Hooks Personalizados**

#### **`useBookSearch.ts`**
- **Propósito**: Lógica reutilizable para búsqueda de libros
- **Funciones principales**:
  - Maneja estado de búsqueda (término, resultados, loading, error)
  - Detecta tipo de búsqueda (ISBN, autor, título)
  - Formatea query para Google Books API
  - Ejecuta llamadas HTTP a la API

### **APIs del Backend**

#### **`/api/reviews/route.ts`**
- **GET**: Obtiene todas las reseñas de un libro específico
- **POST**: Crea una nueva reseña y guarda el libro si no existe

#### **`/api/reviews/vote/route.ts`**
- **POST**: Registra un voto en una reseña (previene duplicados por IP)

### **Configuración**

#### **`prisma/schema.prisma`**
- Define el esquema de la base de datos
- Especifica relaciones entre tablas
- Configura tipos de datos y restricciones

#### **`lib/prisma.ts`**
- Configura cliente de Prisma
- Maneja conexión a PostgreSQL
- Previene múltiples instancias en desarrollo

---

## 🚀 **Cómo Ejecutar el Proyecto**

### **Requisitos Previos**
- Node.js instalado
- PostgreSQL ejecutándose
- Credenciales de base de datos

### **Pasos de Instalación**

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar base de datos**:
   - Crear archivo `.env` con:
   ```
   DATABASE_URL="postgresql://postgres:tu_password@localhost:5432/libros_db?schema=public"
   ```

3. **Ejecutar migraciones**:
   ```bash
   npx prisma migrate dev
   ```

4. **Iniciar servidor**:
   ```bash
   npm run dev
   ```

5. **Abrir en navegador**:
   ```
   http://localhost:3000
   ```

---

## 🎯 **Funcionalidades Implementadas**

### ✅ **Búsqueda de Libros**
- Búsqueda por título, autor, ISBN
- Detección automática del tipo de búsqueda
- Resultados con información completa
- Manejo de errores y estados de carga

### ✅ **Detalles del Libro**
- Página dedicada para cada libro
- Información completa (portada, descripción, autor, etc.)
- Enlaces a vista previa y más información
- Navegación de vuelta a búsqueda

### ✅ **Sistema de Reseñas**
- Formulario con validación
- Calificación por estrellas (1-5)
- Campo de texto para opinión detallada
- Persistencia en base de datos PostgreSQL

### ✅ **Votación Comunitaria**
- Votos positivos y negativos en reseñas
- Prevención de votos duplicados por IP
- Cálculo automático de utilidad
- Ordenamiento por votos

### ✅ **Interfaz de Usuario**
- Diseño responsive con Tailwind CSS
- Estados de carga y error
- Transiciones y animaciones suaves
- Experiencia de usuario intuitiva

---

## 🔧 **Posibles Mejoras Futuras**

- **Autenticación de usuarios** con cuentas reales
- **Sistema de favoritos** para guardar libros
- **Recomendaciones personalizadas** basadas en reseñas
- **Búsqueda avanzada** con filtros por género, año, etc.
- **Sistema de comentarios** en las reseñas
- **Notificaciones** cuando alguien vota tu reseña
- **API propia** para compartir reseñas entre aplicaciones

---
