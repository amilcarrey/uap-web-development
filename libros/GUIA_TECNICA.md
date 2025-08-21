# 🔧 Guía Técnica Detallada - Plataforma de Reseñas de Libros

## 📚 **Explicación del Código - Paso a Paso**

Esta guía explica cada archivo y función del proyecto.

---

## 🎯 **1. Estructura General del Proyecto**

### **¿Qué es cada carpeta?**

```
📁 src/app/          → Páginas y rutas de la aplicación
📁 src/components/   → Componentes React reutilizables
📁 src/hooks/        → Lógica personalizada que se puede reutilizar
📁 src/lib/          → Configuraciones y utilidades
📁 prisma/           → Configuración de la base de datos
```

---

## 🧩 **2. Componentes Explicados**

### **🔍 BookSearch.tsx - El Formulario de Búsqueda**

**¿Qué hace?** 
Permite al usuario buscar libros escribiendo texto en una caja.

**Código principal:**
```tsx
// "use client" le dice a Next.js que este componente se ejecuta en el navegador
"use client";

// Importamos React y nuestro hook personalizado
import React from 'react';
import useBookSearch from '../hooks/useBookSearch';

const BookSearch = () => {
  // Obtenemos funciones y datos de nuestro hook personalizado
  const { searchTerm, setSearchTerm, books, isLoading, error, searchBooks } = useBookSearch();

  // Esta función se ejecuta cuando el usuario envía el formulario
  const handleSearch = (e) => {
    e.preventDefault(); // Evita que la página se recargue
    searchBooks(); // Llama a la función que busca libros
  };

  // Lo que se muestra en pantalla
  return (
    <div>
      <form onSubmit={handleSearch}>
        <input 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar libros..."
        />
        <button type="submit">Buscar</button>
      </form>
      
      {/* Muestra "Cargando..." mientras busca */}
      {isLoading && <p>Cargando...</p>}
      
      {/* Muestra error si algo sale mal */}
      {error && <p>{error}</p>}
      
      {/* Muestra la lista de libros encontrados */}
      <BookList books={books} />
    </div>
  );
};
```

**¿Cómo funciona?**
1. Usuario escribe en la caja de texto
2. Al hacer clic en "Buscar", se llama a `handleSearch`
3. `handleSearch` llama a `searchBooks` del hook
4. Se muestran los resultados o un mensaje de error

---

### **📖 BookList.tsx - La Lista de Libros**

**¿Qué hace?** 
Muestra los libros encontrados en formato de tarjetas bonitas.

**Código principal:**
```tsx
// Definimos qué información tiene cada libro
interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    imageLinks?: { thumbnail?: string };
    // ... más información
  };
}

const BookList = ({ books }) => {
  const router = useRouter(); // Para navegar a otras páginas

  // Función que se ejecuta cuando usuario hace clic en un libro
  const handleBookClick = (bookId) => {
    router.push(`/book/${bookId}`); // Va a la página de detalles
  };

  // Si no hay libros, muestra mensaje
  if (books.length === 0) {
    return <p>No se encontraron libros.</p>;
  }

  // Muestra cada libro en una tarjeta
  return (
    <div className="grid gap-4">
      {books.map((book) => (
        <div 
          key={book.id}
          onClick={() => handleBookClick(book.id)}
          className="cursor-pointer bg-white rounded shadow"
        >
          {/* Imagen del libro */}
          <img src={book.volumeInfo.imageLinks?.thumbnail} />
          
          {/* Título y autor */}
          <h3>{book.volumeInfo.title}</h3>
          <p>{book.volumeInfo.authors?.join(', ')}</p>
        </div>
      ))}
    </div>
  );
};
```

**¿Cómo funciona?**
1. Recibe una lista de libros como parámetro
2. Si hay libros, los muestra en tarjetas
3. Cada tarjeta es clickeable y lleva a la página de detalles

---

### **⭐ ReviewForm.tsx - Formulario de Reseñas**

**¿Qué hace?** 
Permite al usuario escribir una reseña con calificación por estrellas.

**Código principal:**
```tsx
const ReviewForm = ({ bookId, bookData, onReviewAdded }) => {
  // Estados para guardar lo que escribe el usuario
  const [rating, setRating] = useState(0); // Calificación (1-5 estrellas)
  const [reviewText, setReviewText] = useState(''); // Texto de la reseña
  const [userName, setUserName] = useState(''); // Nombre del usuario
  const [isSubmitting, setIsSubmitting] = useState(false); // ¿Está enviando?

  // Función que se ejecuta cuando el usuario envía la reseña
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Verificar que todos los campos estén llenos
    if (!rating || !reviewText.trim() || !userName.trim()) {
      alert('Por favor completa todos los campos');
      return;
    }

    setIsSubmitting(true); // Mostrar que está cargando

    try {
      // Enviar datos al servidor
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId,
          userName: userName.trim(),
          rating,
          reviewText: reviewText.trim(),
          bookData
        })
      });

      if (response.ok) {
        // Si se guardó correctamente, limpiar formulario
        setRating(0);
        setReviewText('');
        setUserName('');
        alert('¡Reseña agregada exitosamente!');
        
        // Avisar al componente padre que se agregó una reseña
        if (onReviewAdded) onReviewAdded();
      } else {
        throw new Error('Error al guardar la reseña');
      }
    } catch (error) {
      alert('Error al agregar la reseña. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false); // Quitar estado de carga
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Campo para el nombre */}
      <input 
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="Tu nombre"
      />

      {/* Sistema de estrellas */}
      <div>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}
          >
            ⭐
          </button>
        ))}
      </div>

      {/* Campo para el texto de la reseña */}
      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="Escribe tu reseña..."
      />

      {/* Botón para enviar */}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Enviando...' : 'Publicar reseña'}
      </button>
    </form>
  );
};
```

**¿Cómo funciona?**
1. Usuario llena nombre, selecciona estrellas y escribe reseña
2. Al enviar, se valida que todos los campos estén completos
3. Se envían los datos al servidor mediante una API
4. Si se guarda correctamente, se limpia el formulario

---

### **📝 ReviewList.tsx - Lista de Reseñas**

**¿Qué hace?** 
Muestra todas las reseñas de un libro y permite votarlas.

**Código principal:**
```tsx
const ReviewList = ({ bookId }) => {
  const [reviews, setReviews] = useState([]); // Lista de reseñas
  const [loading, setLoading] = useState(false); // ¿Está cargando?
  const [sortBy, setSortBy] = useState('newest'); // Cómo ordenar

  // Función para cargar reseñas desde el servidor
  const loadReviews = async () => {
    try {
      setLoading(true);
      
      // Pedir reseñas al servidor
      const response = await fetch(`/api/reviews?bookId=${bookId}`);
      const data = await response.json();
      
      setReviews(data); // Guardar reseñas en el estado
    } catch (error) {
      console.error('Error al cargar reseñas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar reseñas cuando el componente se monta
  useEffect(() => {
    loadReviews();
  }, [bookId]);

  // Función para votar una reseña
  const handleVote = async (reviewId, voteType) => {
    try {
      await fetch('/api/reviews/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, voteType: voteType.toUpperCase() })
      });
      
      // Recargar reseñas para ver votos actualizados
      loadReviews();
    } catch (error) {
      alert('Error al votar. Inténtalo de nuevo.');
    }
  };

  return (
    <div>
      <h2>Reseñas ({reviews.length})</h2>
      
      {/* Selector para ordenar reseñas */}
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="newest">Más recientes</option>
        <option value="rating">Mejor calificadas</option>
        <option value="helpful">Más útiles</option>
      </select>

      {loading ? (
        <p>Cargando reseñas...</p>
      ) : (
        <div>
          {reviews.map((review) => (
            <div key={review.id}>
              <h4>{review.userName}</h4>
              <div>
                {/* Mostrar estrellas */}
                {[...Array(5)].map((_, i) => (
                  <span key={i}>
                    {i < review.rating ? '⭐' : '☆'}
                  </span>
                ))}
              </div>
              <p>{review.reviewText}</p>
              
              {/* Botones de votación */}
              <button onClick={() => handleVote(review.id, 'up')}>
                👍 {review.upvotes}
              </button>
              <button onClick={() => handleVote(review.id, 'down')}>
                👎 {review.downvotes}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

**¿Cómo funciona?**
1. Al cargar, pide todas las reseñas del libro al servidor
2. Muestra cada reseña con nombre, estrellas, texto y votos
3. Usuario puede votar reseñas haciendo clic en 👍 o 👎
4. Se pueden ordenar por fecha, calificación o utilidad

---

## 🎣 **3. Hook Personalizado Explicado**

### **useBookSearch.ts - Lógica de Búsqueda**

**¿Qué hace?** 
Contiene toda la lógica para buscar libros, separada de la interfaz.

**Código principal:**
```tsx
const useBookSearch = () => {
  // Estados que maneja el hook
  const [searchTerm, setSearchTerm] = useState(''); // Lo que escribió el usuario
  const [books, setBooks] = useState([]); // Libros encontrados
  const [isLoading, setIsLoading] = useState(false); // ¿Está buscando?
  const [error, setError] = useState(null); // Mensaje de error

  const searchBooks = async () => {
    if (searchTerm.trim() === '') return; // No buscar si está vacío

    setIsLoading(true); // Mostrar que está cargando
    setError(null); // Limpiar errores anteriores

    try {
      // Detectar si es ISBN (solo números)
      const cleanTerm = searchTerm.replace(/[-\s]/g, ''); // Quitar guiones y espacios
      const isISBN = /^\d{10}(\d{3})?$/.test(cleanTerm); // ¿Son 10 o 13 números?
      
      // Formatear la búsqueda según el tipo
      let query = '';
      if (isISBN) {
        query = `isbn:${cleanTerm}`; // Búsqueda por ISBN
      } else if (searchTerm.toLowerCase().includes('autor:')) {
        const authorName = searchTerm.replace(/autor:/gi, '').trim();
        query = `inauthor:${authorName}`; // Búsqueda por autor
      } else {
        query = searchTerm; // Búsqueda normal por título
      }

      // Llamar a la API de Google Books
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      
      if (data.totalItems === 0) {
        setError('No se encontraron libros con ese término.');
      }
      
      setBooks(data.items || []); // Guardar resultados
    } catch (err) {
      setError('Error al buscar libros. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false); // Quitar estado de carga
    }
  };

  // Devolver todo lo que otros componentes necesitan
  return {
    searchTerm,
    setSearchTerm,
    books,
    isLoading,
    error,
    searchBooks
  };
};
```

**¿Por qué usar un hook?**
- **Reutilizable**: Otros componentes pueden usar la misma lógica
- **Separación**: La lógica está separada de la interfaz
- **Limpio**: El componente se enfoca solo en mostrar, no en la lógica

---

## 🌐 **4. APIs del Backend Explicadas**

### **api/reviews/route.ts - Manejar Reseñas**

**¿Qué hace?** 
Maneja las peticiones HTTP para crear y obtener reseñas.

**Código principal:**
```tsx
// GET - Obtener reseñas de un libro
export async function GET(request) {
  try {
    // Extraer bookId de la URL (?bookId=xxx)
    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get('bookId');

    if (!bookId) {
      return NextResponse.json({ error: 'bookId es requerido' }, { status: 400 });
    }

    // Buscar reseñas en la base de datos
    const reviews = await prisma.review.findMany({
      where: { bookId: bookId },
      orderBy: { createdAt: 'desc' } // Más recientes primero
    });

    return NextResponse.json(reviews); // Devolver reseñas
  } catch (error) {
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}

// POST - Crear nueva reseña
export async function POST(request) {
  try {
    // Obtener datos del cuerpo de la petición
    const body = await request.json();
    const { bookId, userName, rating, reviewText, bookData } = body;

    // Validar que todos los campos estén presentes
    if (!bookId || !userName || !rating || !reviewText) {
      return NextResponse.json({ error: 'Todos los campos son requeridos' }, { status: 400 });
    }

    // Verificar que la calificación esté entre 1 y 5
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'La calificación debe estar entre 1 y 5' }, { status: 400 });
    }

    // Verificar si el libro existe en nuestra base de datos
    let book = await prisma.book.findUnique({ where: { id: bookId } });

    // Si no existe, crearlo con la información de Google Books
    if (!book && bookData) {
      book = await prisma.book.create({
        data: {
          id: bookId,
          title: bookData.title,
          authors: bookData.authors || [],
          publisher: bookData.publisher,
          // ... más campos
        }
      });
    }

    // Crear la reseña
    const review = await prisma.review.create({
      data: { bookId, userName, rating, reviewText }
    });

    return NextResponse.json(review, { status: 201 }); // Devolver reseña creada
  } catch (error) {
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
```

**¿Cómo funciona?**
- **GET**: Cliente pide reseñas → Servidor busca en base de datos → Devuelve lista
- **POST**: Cliente envía reseña → Servidor valida → Guarda en base de datos → Confirma

---

### **api/reviews/vote/route.ts - Manejar Votos**

**¿Qué hace?** 
Permite a los usuarios votar por reseñas útiles.

**Código principal:**
```tsx
export async function POST(request) {
  try {
    const body = await request.json();
    const { reviewId, voteType } = body;

    // Obtener IP del usuario para evitar votos duplicados
    const forwarded = request.headers.get('x-forwarded-for');
    const userIP = forwarded ? forwarded.split(',')[0] : 'unknown';

    // Validaciones
    if (!reviewId || !voteType) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
    }

    // Verificar si el usuario ya votó en esta reseña
    const existingVote = await prisma.vote.findUnique({
      where: {
        reviewId_userIP: { reviewId, userIP } // Combinación única
      }
    });

    if (existingVote) {
      // Si ya votó pero con tipo diferente, actualizar
      if (existingVote.voteType !== voteType) {
        await prisma.vote.update({
          where: { id: existingVote.id },
          data: { voteType }
        });
      } else {
        return NextResponse.json({ error: 'Ya votaste en esta reseña' }, { status: 400 });
      }
    } else {
      // Crear nuevo voto
      await prisma.vote.create({
        data: { reviewId, userIP, voteType }
      });
    }

    // Recalcular votos de la reseña
    const votes = await prisma.vote.findMany({ where: { reviewId } });
    const upvotes = votes.filter(vote => vote.voteType === 'UP').length;
    const downvotes = votes.filter(vote => vote.voteType === 'DOWN').length;

    // Actualizar la reseña con los nuevos conteos
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: { upvotes, downvotes }
    });

    return NextResponse.json(updatedReview);
  } catch (error) {
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
```

**¿Cómo funciona?**
1. Usuario hace clic en 👍 o 👎
2. Se envía petición con ID de reseña y tipo de voto
3. Se verifica que no haya votado antes (por IP)
4. Se guarda el voto y se recalculan los totales
5. Se actualiza la reseña con los nuevos números

---

## 🗄️ **5. Base de Datos Explicada**

### **prisma/schema.prisma - Definición de Tablas**

**¿Qué hace?** 
Define cómo se estructuran los datos en PostgreSQL.

```prisma
// Tabla de libros
model Book {
  id          String @id // ID único del libro (viene de Google Books)
  title       String // Título del libro
  authors     String[] // Lista de autores (array)
  publisher   String? // Editorial (opcional, por eso el ?)
  publishedDate String? // Fecha de publicación
  description String? // Descripción del libro
  imageUrl    String? // URL de la imagen de portada
  pageCount   Int? // Número de páginas
  categories  String[] // Categorías del libro
  language    String? // Idioma
  previewLink String? // Enlace de vista previa
  infoLink    String? // Enlace de más información
  createdAt   DateTime @default(now()) // Cuándo se agregó a nuestra DB
  updatedAt   DateTime @updatedAt // Cuándo se actualizó por última vez
  
  // Relación: un libro puede tener muchas reseñas
  reviews     Review[]
  
  @@map("books") // Nombre de la tabla en PostgreSQL
}

// Tabla de reseñas
model Review {
  id         String   @id @default(cuid()) // ID único generado automáticamente
  bookId     String   // ID del libro al que pertenece esta reseña
  userName   String   // Nombre del usuario que escribió la reseña
  rating     Int      @db.SmallInt // Calificación de 1-5 estrellas
  reviewText String   // Texto de la reseña
  upvotes    Int      @default(0) // Votos positivos (inicia en 0)
  downvotes  Int      @default(0) // Votos negativos (inicia en 0)
  createdAt  DateTime @default(now()) // Cuándo se creó
  updatedAt  DateTime @updatedAt // Cuándo se actualizó
  
  // Relación: cada reseña pertenece a un libro
  book       Book     @relation(fields: [bookId], references: [id], onDelete: Cascade)
  
  // Relación: una reseña puede tener muchos votos
  votes      Vote[]
  
  @@map("reviews") // Nombre de la tabla en PostgreSQL
}

// Tabla de votos
model Vote {
  id       String   @id @default(cuid()) // ID único
  reviewId String   // ID de la reseña votada
  userIP   String   // IP del usuario (para evitar votos duplicados)
  voteType VoteType // Tipo de voto (UP o DOWN)
  createdAt DateTime @default(now()) // Cuándo se votó
  
  // Relación: cada voto pertenece a una reseña
  review   Review   @relation(fields: [reviewId], references: [id], onDelete: Cascade)
  
  // Restricción: una IP solo puede votar una vez por reseña
  @@unique([reviewId, userIP])
  @@map("votes")
}

// Enum para tipos de voto
enum VoteType {
  UP   // Voto positivo
  DOWN // Voto negativo
}
```

**¿Cómo se relacionan las tablas?**
```
Book (1) ←→ (muchos) Review (1) ←→ (muchos) Vote
```
- Un libro puede tener muchas reseñas
- Una reseña puede tener muchos votos
- Un voto pertenece a una sola reseña

---

## 🔧 **6. Configuración Explicada**

### **lib/prisma.ts - Conexión a Base de Datos**

```tsx
import { PrismaClient } from '@prisma/client';

// Variable global para guardar la conexión
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Crear o reutilizar conexión existente
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// En desarrollo, guardar la conexión globalmente para evitar múltiples conexiones
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

**¿Por qué esto?**
- En desarrollo, Next.js reinicia el servidor frecuentemente
- Sin esto, se crearían muchas conexiones a PostgreSQL
- Esto reutiliza la misma conexión, siendo más eficiente

---

## 🚀 **7. Flujo Completo de la Aplicación**

### **Ejemplo: Usuario busca "Harry Potter"**

1. **Frontend**: Usuario escribe "Harry Potter" y hace clic en "Buscar"
2. **Hook**: `useBookSearch` detecta que no es ISBN, formatea query normal
3. **API Externa**: Se llama a `https://www.googleapis.com/books/v1/volumes?q=Harry%20Potter`
4. **Frontend**: Se muestran resultados en tarjetas
5. **Navegación**: Usuario hace clic en un libro específico
6. **Routing**: Next.js navega a `/book/[id-del-libro]`
7. **Página Detalles**: Se carga información completa del libro
8. **Reseñas**: Se cargan reseñas existentes desde PostgreSQL

### **Ejemplo: Usuario escribe reseña**

1. **Frontend**: Usuario llena formulario (nombre, estrellas, texto)
2. **Validación**: Se verifica que todos los campos estén completos
3. **API Call**: Se envía POST a `/api/reviews`
4. **Backend**: Se valida información y se guarda en PostgreSQL
5. **Respuesta**: Se confirma que se guardó correctamente
6. **Frontend**: Se limpia formulario y se recarga lista de reseñas

### **Ejemplo: Usuario vota reseña**

1. **Frontend**: Usuario hace clic en 👍 en una reseña
2. **API Call**: Se envía POST a `/api/reviews/vote`
3. **Backend**: Se verifica que no haya votado antes (por IP)
4. **Base de Datos**: Se guarda voto y se recalculan totales
5. **Frontend**: Se actualiza la interfaz con nuevos números

---

## 💡 **8. Consejos para Entender el Código**

### **¿Cómo leer un componente React?**
1. **Imports**: ¿Qué necesita este componente?
2. **Props/Parámetros**: ¿Qué información recibe?
3. **Estados**: ¿Qué información cambia?
4. **Funciones**: ¿Qué acciones puede hacer?
5. **Return**: ¿Qué se muestra en pantalla?

### **¿Cómo funciona el estado en React?**
```tsx
const [nombre, setNombre] = useState('inicial');
// nombre: valor actual
// setNombre: función para cambiar el valor
// 'inicial': valor cuando se carga por primera vez
```

### **¿Qué es async/await?**
```tsx
// Sin async/await (complicado)
fetch('/api/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));

// Con async/await (más fácil de leer)
try {
  const response = await fetch('/api/data');
  const data = await response.json();
  console.log(data);
} catch (error) {
  console.error(error);
}
```

---

## 🔍 **9. Debugging - ¿Dónde Buscar Problemas?**

### **Si la búsqueda no funciona:**
1. **Consola del navegador**: ¿Hay errores de JavaScript?
2. **Network tab**: ¿Se está llamando a la API de Google Books?
3. **useBookSearch.ts**: ¿Se está formateando bien el query?

### **Si las reseñas no se guardan:**
1. **Consola del navegador**: ¿Hay errores al enviar?
2. **Terminal del servidor**: ¿Hay errores en las APIs?
3. **Base de datos**: ¿Está PostgreSQL ejecutándose?
4. **Prisma**: ¿Las migraciones están aplicadas?

### **Si los votos no funcionan:**
1. **API route**: ¿Se está detectando bien la IP?
2. **Base de datos**: ¿Existen las restricciones de voto único?
3. **Frontend**: ¿Se está recargando la lista después de votar?

---

## 📚 **10. Recursos para Aprender Más**

### **Documentación Oficial:**
- [Next.js](https://nextjs.org/docs) - Framework principal
- [React](https://react.dev/learn) - Biblioteca de UI
- [Prisma](https://www.prisma.io/docs) - ORM para base de datos
- [Tailwind CSS](https://tailwindcss.com/docs) - Framework de CSS

### **Conceptos Clave a Estudiar:**
- **React Hooks** (useState, useEffect)
- **Async/Await** (manejo de promesas)
- **API REST** (GET, POST, PUT, DELETE)
- **SQL básico** (para entender la base de datos)
- **TypeScript** (tipado de JavaScript)

---

*Esta guía explica cada parte del código de manera simple. ¡Experimenta cambiando cosas pequeñas para ver cómo funciona!*
