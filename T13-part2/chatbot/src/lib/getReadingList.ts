import { prisma } from "@/lib/prisma";

// Función auxiliar para obtener info del libro desde Google Books
async function fetchBookDetails(bookId: string) {
  try {
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}?key=${process.env.GOOGLE_BOOKS_API_KEY}`);
    if (!res.ok) return null;
    const data = await res.json();
    return {
      title: data.volumeInfo?.title || "Título no disponible",
      authors: data.volumeInfo?.authors?.join(", ") || "Autor desconocido",
      thumbnail: data.volumeInfo?.imageLinks?.thumbnail || null,
    };
  } catch {
    return null;
  }
}

export async function getReadingList({
  userId = "demo-user",
  limit = 10,
  order = "desc",
}: {
  userId?: string;
  limit?: number;
  order?: "asc" | "desc";
}) {
  const books = await prisma.readingList.findMany({
    where: { userId },
    orderBy: { addedAt: order },
    take: limit,
  });

  if (books.length === 0) {
    return { message: "📭 Tu lista de lectura está vacía." };
  }

  // Traer detalles de cada libro desde Google Books
  const detailedBooks = await Promise.all(
    books.map(async (book) => {
      const details = await fetchBookDetails(book.bookId);
      return {
        id: book.bookId,
        title: details?.title || "Título no disponible",
        authors: details?.authors || "Autor desconocido",
        thumbnail: details?.thumbnail,
        priority: book.priority,
        notes: book.notes,
        addedAt: book.addedAt,
      };
    })
  );

  return {
    message: `📚 Tienes ${books.length} libro(s) en tu lista de lectura:`,
    books: detailedBooks,
  };
}
