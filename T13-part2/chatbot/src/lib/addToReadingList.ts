import { prisma } from "@/lib/prisma";

export async function addToReadingListFn({
  bookId,
  userId = "demo-user",
  priority = "medium",
  notes = "",
}: {
  bookId: string;
  userId?: string;
  priority?: string;
  notes?: string;
}) {
  if (!bookId) throw new Error("Missing bookId");

  const exists = await prisma.readingList.findFirst({
    where: { userId, bookId },
  });

  if (exists) {
    return { message: "📚 El libro ya está en tu lista de lectura." };
  }

  const newItem = await prisma.readingList.create({
    data: { userId, bookId, priority, notes },
  });

  return {
    message: "✅ Libro agregado a tu lista de lectura.",
    item: newItem,
  };
}
