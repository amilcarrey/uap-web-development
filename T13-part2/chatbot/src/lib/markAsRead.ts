import { prisma } from "@/lib/prisma";

export async function markAsReadFn({
  bookId,
  userId = "demo-user",
  rating,
  review,
  dateFinished = new Date(),
}: {
  bookId: string;
  userId?: string;
  rating?: number;
  review?: string;
  dateFinished?: Date;
}) {
  if (!bookId) throw new Error("Missing bookId");

  // Eliminar de la lista de lectura si existe
  await prisma.readingList.deleteMany({
    where: { userId, bookId },
  });

  // Crear registro en libros leídos
  const readBook = await prisma.readBook.create({
    data: { 
      userId, 
      bookId, 
      rating, 
      review, 
      dateFinished: new Date(new Date().setHours(0, 0, 0, 0)) // fecha normalizada al inicio del día local
    },
  });
  return {
    message: `✅ Libro marcado como leído${rating ? ` con ${rating} estrellas` : ""}.`,
    book: readBook,
  };
}
