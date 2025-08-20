# Books & Reviews

Una aplicación minimalista y elegante para buscar libros y compartir reseñas con tonos cálidos y café.

## 🚀 Características

- **Búsqueda de libros** usando la API de Google Books
- **Modal de información** con detalles completos del libro
- **Sistema de reseñas** con calificación de 1-5 estrellas
- **Diseño minimalista** con tonos café y cálidos
- **Menú principal** con opciones de búsqueda y reseñas
- **Sección de reseñas personales** con persistencia local
- **Sin autenticación** - uso directo y simple

## 🛠️ Tecnologías

- **Next.js 15** - Framework de React con App Router
- **TypeScript** - Type safety completo
- **Tailwind CSS v4** - Estilos modernos
- **Google Books API** - Datos de libros
- **Server Actions** - Lógica del servidor
- **localStorage** - Persistencia de reseñas

## 📖 Cómo usar

1. **Menú principal** - Elige entre buscar libros o ver tus reseñas
2. **Buscar libros** - Ingresa un término en la barra de búsqueda
3. **Ver resultados** - Explora los libros encontrados
4. **Más información** - Haz clic en "Más Info" para ver detalles
5. **Dejar reseña** - Califica con estrellas y escribe tu opinión
6. **Mis reseñas** - Revisa todas las reseñas que has escrito

## 🔧 Instalación

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📱 Funcionalidades

### Menú Principal
- Pantalla de bienvenida elegante
- Opciones claras para buscar o ver reseñas
- Diseño responsive y moderno

### Búsqueda
- Por título, autor o ISBN
- Resultados en tiempo real
- Imágenes de portada automáticas
- Barra de búsqueda animada

### Modal de Información
- Imagen de portada
- Descripción completa
- Información del autor
- Detalles de publicación
- Formulario de reseña integrado

### Reseñas
- Calificación de 1-5 estrellas
- Comentarios escritos
- Almacenamiento local persistente
- Vista personal de todas las reseñas

## 🎨 Diseño

- **Colores:** Tonos café y cálidos (amber)
- **Tipografía:** Geist Sans moderna
- **Responsive:** Optimizado para móvil y desktop
- **Interacciones:** Hover states y transiciones suaves
- **Animaciones:** Barra de búsqueda dinámica

## 📁 Estructura del Proyecto

```
app/
├── actions/
│   └── books.ts              # Server actions para Google Books API
├── components/
│   ├── BookCard.tsx          # Tarjeta de libro en resultados
│   ├── BookModal.tsx         # Modal de detalles y reseñas
│   ├── MainMenu.tsx          # Menú principal
│   └── ReviewsSection.tsx    # Sección de reseñas personales
├── layout.tsx                # Layout principal
├── page.tsx                  # Página principal con routing
└── globals.css               # Estilos globales
```

## 🔄 Flujo de la Aplicación

1. **Inicio** → Menú principal con opciones
2. **Búsqueda** → Formulario de búsqueda y resultados
3. **Detalles** → Modal con información completa del libro
4. **Reseña** → Formulario integrado en el modal
5. **Mis Reseñas** → Vista de todas las reseñas guardadas

## 🌟 Características Destacadas

- ✅ **Sin autenticación** - Uso directo y simple
- ✅ **Persistencia local** - Las reseñas se guardan en el navegador
- ✅ **Diseño responsive** - Funciona en todos los dispositivos
- ✅ **API externa** - Integración con Google Books
- ✅ **TypeScript** - Código tipado y seguro
- ✅ **Server Components** - Rendimiento optimizado
- ✅ **Client Components** - Interactividad donde se necesita
