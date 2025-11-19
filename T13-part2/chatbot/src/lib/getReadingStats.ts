import { prisma } from "@/lib/prisma";
import { getBookDetails } from "./getBookDetails";
import { searchBooks } from "./searchBooks";

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

export async function getReadingStatsFn({
  userId = "demo-user",
  period = "all-time",
  challengeType = "all",
}: {
  userId?: string;
  period?: "all-time" | "year" | "month" | "week";
  challengeType?: "month" | "year" | "quality" | "streak" | "all";
}) {
  const now = new Date();
  let dateFilter: Date | undefined;

  if (period === "year") dateFilter = new Date(now.getFullYear(), 0, 1);
  if (period === "month") dateFilter = new Date(now.getFullYear(), now.getMonth(), 1);
  if (period === "week") {
    const day = now.getDay();
    dateFilter = new Date(now);
    dateFilter.setDate(now.getDate() - day);
  }

  const where = {
    userId,
    ...(dateFilter && { dateFinished: { gte: dateFilter } }),
  };

  const books = await prisma.readBook.findMany({ where });

  // 🔹 Obtener TODOS los libros para cálculos globales (no filtrados por período)
  const allBooks = dateFilter 
    ? await prisma.readBook.findMany({ where: { userId } })
    : books; // Si es "all-time", reutilizamos la misma query

  if (books.length === 0) {
    return {
      message: "📭 No tienes libros leídos aún. Empieza a leer y te mostraré tus estadísticas pronto.",
    };
  }

  // 🔹 Traer info de Google Books
  const details = await Promise.all(books.map((b) => getBookDetails({ bookId: b.bookId })));

  const totalBooks = books.length;
  const totalRated = books.filter((b) => b.rating).length;
  const averageRating = totalRated
    ? (
        books.reduce((acc, b) => acc + (b.rating || 0), 0) / totalRated
      ).toFixed(2)
    : "N/A";

  const totalPages = details.reduce((acc, d) => acc + (d?.pageCount || 0), 0);

  // Agrupar autores y categorías
  const authors: Record<string, number> = {};
  const genres: Record<string, number> = {};

  details.forEach((d) => {
    if (!d) return;
    d.authors?.forEach((a) => (authors[a] = (authors[a] || 0) + 1));
    d.categories?.forEach((c) => (genres[c] = (genres[c] || 0) + 1));
  });

  const topAuthor = Object.entries(authors).sort((a, b) => b[1] - a[1])[0]?.[0] || "Desconocido";
  const topGenre = Object.entries(genres).sort((a, b) => b[1] - a[1])[0]?.[0] || "Sin categoría";

  //  Calcular racha de lectura
  const sortedDates = books
    .map((b) => {
      // Convertir dateFinished a Date si es string
      const date = b.dateFinished instanceof Date 
        ? b.dateFinished 
        : new Date(b.dateFinished);
      return date;
    })
    .sort((a, b) => b.getTime() - a.getTime());
  let streak = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const diff = (sortedDates[i - 1].getTime() - sortedDates[i].getTime()) / (1000 * 60 * 60 * 24);
    if (diff <= 2) streak++;
    else break;
  }

  // 🔹 Calcular libros leídos este mes (usando TODOS los libros)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  monthStart.setHours(0, 0, 0, 0); // Asegurar que sea el inicio del día
  
  const booksThisMonth = allBooks.filter((b) => {
    // Convertir dateFinished a Date si es string
    const finishedDate = b.dateFinished instanceof Date 
      ? b.dateFinished 
      : new Date(b.dateFinished);
    return finishedDate >= monthStart;
  }).length;




// 🎯 Generar desafíos personalizados con recomendaciones de libros reales
let challenges: string[] = [];

// Buscar libros recomendados según el género favorito del usuario
let recommendedBooks: any[] = [];
let randomSearchTopics = ["technology", "science fiction", "business", "self-help", "history", "psychology", "programming"];
try {
  if (topGenre && topGenre !== "Sin categoría") {
    recommendedBooks = await searchBooks({ query: topGenre, maxResults: 8, orderBy: "relevance" });
  } else {
    // Elegir un tema aleatorio para variedad
    const randomTopic = randomSearchTopics[Math.floor(Math.random() * randomSearchTopics.length)];
    recommendedBooks = await searchBooks({ query: randomTopic, maxResults: 8, orderBy: "relevance" });
  }
} catch (error) {
  console.error("Error buscando recomendaciones:", error);
}

// Función para obtener libros aleatorios únicos
const getRandomBooks = (books: any[], count: number) => {
  const shuffled = [...books].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// 📚 DESAFÍO MENSUAL - Con libro específico (variado)
const generateMonthChallenge = () => {
  const variants = [
    // Variante para principiantes
    () => {
      if (totalBooks === 0 && recommendedBooks.length > 0) {
        const book = getRandomBooks(recommendedBooks, 1)[0];
        return `📖 **Desafío del mes:** Lee tu primer libro. Te recomiendo "${book.title}" de ${book.authors.join(", ")}`;
      }
      return null;
    },
    // Variante: 2 libros específicos
    () => {
      if (recommendedBooks.length >= 2) {
        const [book1, book2] = getRandomBooks(recommendedBooks, 2);
        return `📖 **Desafío del mes:** Lee estos 2 libros antes de fin de mes:\n   • "${book1.title}" de ${book1.authors.join(", ")}\n   • "${book2.title}" de ${book2.authors.join(", ")}`;
      }
      return null;
    },
    // Variante: 1 libro del género favorito
    () => {
      if (recommendedBooks.length > 0) {
        const book = getRandomBooks(recommendedBooks, 1)[0];
        return `📖 **Desafío del mes:** Lee "${book.title}" de ${book.authors.join(", ")}. Este libro te ayudará a explorar más sobre ${topGenre}.`;
      }
      return null;
    },
    // Variante: Meta numérica con sugerencia
    () => {
      if (recommendedBooks.length > 0) {
        const book = getRandomBooks(recommendedBooks, 1)[0];
        return `📖 **Desafío del mes:** Lee 3 libros este mes. Empieza con "${book.title}" de ${book.authors.join(", ")}.`;
      }
      return `📖 **Desafío del mes:** Lee 3 libros este mes para mantener tu ritmo de lectura.`;
    }
  ];
  
  // Intentar variantes hasta encontrar una válida
  for (const variant of variants) {
    const challenge = variant();
    if (challenge) return challenge;
  }
  return `📖 **Desafío del mes:** Lee 2 libros más este mes (llevas ${totalBooks} en total).`;
};

// 🏆 DESAFÍO ANUAL - Variado (meta de libros con títulos específicos)
const generateYearChallenge = () => {
  const yearGoals = [15, 20, 25, 30];
  const targetGoal = yearGoals.find(g => g > totalBooks) || 30;
  const booksNeeded = targetGoal - totalBooks;
  
  const variants = [
    // Variante: Lista de 3 libros sugeridos
    () => {
      if (recommendedBooks.length >= 3) {
        const books = getRandomBooks(recommendedBooks, 3);
        const examples = books.map(b => `"${b.title}"`).join(", ");
        return `🏆 **Desafío anual:** Lee ${targetGoal} libros este año (te faltan ${booksNeeded}). Sugerencias: ${examples}.`;
      }
      return null;
    },
    // Variante: Enfoque en género específico
    () => {
      if (recommendedBooks.length >= 5 && topGenre !== "Sin categoría") {
        const books = getRandomBooks(recommendedBooks, 5);
        const titles = books.map((b, i) => `\n   ${i+1}. "${b.title}" de ${b.authors.join(", ")}`).join("");
        return `🏆 **Desafío anual:** Lee ${booksNeeded} libros más de ${topGenre} para alcanzar ${targetGoal} este año. Aquí tienes 5 opciones:${titles}`;
      }
      return null;
    },
    // Variante: Simple con meta
    () => {
      return `🏆 **Desafío anual:** Meta de ${targetGoal} libros este año. Llevas ${totalBooks}, te faltan ${booksNeeded}. ¡Tú puedes!`;
    }
  ];
  
  for (const variant of variants) {
    const challenge = variant();
    if (challenge) return challenge;
  }
  return variants[2]();
};

// ⭐ DESAFÍO DE CALIDAD
const generateQualityChallenge = () => {
  const avgRating = Number(averageRating);
  if (!isNaN(avgRating) && avgRating < 4.0) {
    return `⭐ **Desafío de calidad:** Busca lecturas con mejores reseñas para subir tu promedio (actual: ${averageRating}⭐). Asegúrate de calificar con 4+ estrellas.`;
  } else if (avgRating >= 4.5) {
    return `⭐ **Desafío de calidad:** Mantén tu excelente promedio de ${averageRating}⭐ explorando nuevos autores.`;
  }
  return null;
};

// 🔥 DESAFÍO DE RACHA
const generateStreakChallenge = () => {
  if (streak < 7) {
    return `🔥 **Desafío de racha:** Llega a 7 días consecutivos leyendo (racha actual: ${streak} día${streak !== 1 ? 's' : ''}).`;
  } else {
    return `🔥 **Desafío de racha:** ¡Increíble racha de ${streak} días! Mantén el hábito sin romperla.`;
  }
};

// Generar desafíos según el tipo solicitado
if (challengeType === "month") {
  challenges.push(generateMonthChallenge());
} else if (challengeType === "year") {
  challenges.push(generateYearChallenge());
} else if (challengeType === "quality") {
  const qualityChallenge = generateQualityChallenge();
  if (qualityChallenge) challenges.push(qualityChallenge);
} else if (challengeType === "streak") {
  challenges.push(generateStreakChallenge());
} else {
  // "all" - mostrar todos
  challenges.push(generateMonthChallenge());
  challenges.push(generateYearChallenge());
  const qualityChallenge = generateQualityChallenge();
  if (qualityChallenge) challenges.push(qualityChallenge);
  challenges.push(generateStreakChallenge());
}

// 🎯 Construir mensaje enriquecido
let message = "";

// Si solo piden un desafío específico, mostrar solo ese
if (challengeType !== "all") {
  message = `${challenges.join("\n\n")}

¡Buena suerte! 📚✨`;
} else {
  // Mostrar estadísticas completas + todos los desafíos
  message = `
📊 **Tus estadísticas de lectura:**

📚 Libros leídos: ${totalBooks}
📖 Páginas totales: ${totalPages.toLocaleString()}
⭐ Rating promedio: ${averageRating}
🎯 Género favorito: ${topGenre}
✍️ Autor favorito: ${topAuthor}
📅 Este mes: ${booksThisMonth} libro(s)
🔥 Racha actual: ${streak} día${streak > 1 ? "s" : ""} consecutivo${streak > 1 ? "s" : ""}

---

🎯 **Tus desafíos personalizados:**

${challenges.join("\n\n")}

---

¡Sigue leyendo y cumple tus metas! 📚✨
`;
}

  // Retornar tanto el mensaje como los datos estructurados
  return { 
    message,
    totalBooks,
    totalPages,
    averageRating,
    topGenre,
    topAuthor,
    booksThisMonth,
    streak,
    challenges,
  };
}
