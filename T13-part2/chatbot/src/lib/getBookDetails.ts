import { prisma } from "@/lib/prisma";

export async function getBookDetails({ bookId }: { bookId: string }) {
  // 1. Buscar en caché primero
  const cached = await prisma.bookCache.findUnique({
    where: { bookId },
  });

  // Si existe en caché y tiene menos de 7 días, retornar del caché
  if (cached) {
    const cacheAge = Date.now() - cached.cachedAt.getTime();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    
    if (cacheAge < sevenDays) {
      console.log(`📦 Caché HIT para bookId: ${bookId}`);
      return {
        id: bookId,
        title: cached.title,
        authors: JSON.parse(cached.authors),
        description: cached.description || "Sin descripción disponible.",
        pageCount: cached.pageCount,
        categories: cached.categories ? JSON.parse(cached.categories) : [],
        publishedDate: cached.publishedDate || "Desconocido",
        rating: cached.rating,
        ratingsCount: cached.ratingsCount,
        thumbnail: cached.thumbnail || "",
      };
    }
  }

  // 2. Si no está en caché o es viejo, llamar a Google Books API
  console.log(`🌐 Caché MISS para bookId: ${bookId} - Llamando a Google Books API`);
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY!;
  const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}?key=${apiKey}`);
  if (!res.ok) throw new Error("Error al obtener detalles del libro");
  const data = await res.json();

  const volume = data.volumeInfo;
  const bookData = {
    id: data.id,
    title: volume.title,
    authors: volume.authors || [],
    description: volume.description || "Sin descripción disponible.",
    pageCount: volume.pageCount || 0,
    categories: volume.categories || [],
    publishedDate: volume.publishedDate || "Desconocido",
    rating: volume.averageRating || null,
    ratingsCount: volume.ratingsCount || 0,
    thumbnail: volume.imageLinks?.thumbnail || "",
  };

  // 3. Guardar en caché (upsert para actualizar si ya existe)
  await prisma.bookCache.upsert({
    where: { bookId },
    create: {
      bookId,
      title: bookData.title,
      authors: JSON.stringify(bookData.authors),
      description: bookData.description,
      pageCount: bookData.pageCount,
      categories: JSON.stringify(bookData.categories),
      publishedDate: bookData.publishedDate,
      rating: bookData.rating,
      ratingsCount: bookData.ratingsCount,
      thumbnail: bookData.thumbnail,
    },
    update: {
      title: bookData.title,
      authors: JSON.stringify(bookData.authors),
      description: bookData.description,
      pageCount: bookData.pageCount,
      categories: JSON.stringify(bookData.categories),
      publishedDate: bookData.publishedDate,
      rating: bookData.rating,
      ratingsCount: bookData.ratingsCount,
      thumbnail: bookData.thumbnail,
      cachedAt: new Date(),
    },
  });

  return bookData;
}

// Función auxiliar para obtener detalles de cada libro leído
// async function fetchBookDetails(bookId: string) {
//   try {
//     const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}?key=${process.env.GOOGLE_BOOKS_API_KEY}`);
//     if (!res.ok) return null;
//     const data = await res.json();
//     return {
//       title: data.volumeInfo?.title || "Título no disponible",
//       authors: data.volumeInfo?.authors || ["Autor desconocido"],
//       pageCount: data.volumeInfo?.pageCount || 0,
//       categories: data.volumeInfo?.categories || ["Sin categoría"],
//     };
//   } catch {
//     return null;
//   }
// }