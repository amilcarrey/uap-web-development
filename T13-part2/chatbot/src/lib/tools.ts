import { tool } from "ai";
import { z } from "zod";
import { searchBooks as searchBooksFn } from "@/lib/searchBooks";
import { addToReadingListFn } from "@/lib/addToReadingList";
import { getReadingList as getReadingListFn } from "@/lib/getReadingList";
import { markAsReadFn } from "@/lib/markAsRead";
import { getReadingStatsFn } from "@/lib/getReadingStats";
import { getBookDetails as getBookDetailsFn } from "@/lib/getBookDetails";

// Tool 1: Buscar libros
export const searchBooks = tool({
  description: "Busca libros en Google Books según una consulta del usuario (título, autor o tema). SIEMPRE debes presentar los resultados al usuario en formato de lista numerada con título y autores.",
  parameters: z.object({
    query: z.string().describe("Término de búsqueda (por ejemplo: 'inteligencia artificial' o 'novelas de ciencia ficción')"),
    maxResults: z.number().optional().default(10),
    orderBy: z.enum(["relevance", "newest"]).optional().default("relevance"),
  }),
  execute: async ({ query, maxResults, orderBy }) => {
    console.log("🔍 Ejecutando tool searchBooks con:", { query, maxResults, orderBy });
    const results = await searchBooksFn({ query, maxResults, orderBy });
    console.log("📚 Resultados devueltos:", results.length);
    
    if (results.length === 0) {
      return {
        message: `No se encontraron libros para "${query}". Intenta con otros términos de búsqueda.`,
        books: []
      };
    }
    
    return {
      message: `Encontré ${results.length} libro(s) sobre "${query}":`,
      books: results
    };
  },
});

// Tool 2: Agregar libro a la lista de lectura
export const addToReadingList = tool({
  description: "Agrega un libro a la lista de lectura del usuario. Devuelve un mensaje de confirmación que DEBES mostrar al usuario. NUNCA expongas los parámetros técnicos (bookId, userId, priority) al usuario, solo muestra el mensaje de confirmación.",
  parameters: z.object({
    bookId: z.string().describe("ID único del libro en Google Books."),
    userId: z.string().optional().default("demo-user"),
    priority: z.enum(["low", "medium", "high"]).optional().default("medium"),
    notes: z.string().optional().default(""),
  }),
  execute: async ({ bookId, userId, priority, notes }) => {
    console.log("🧠 Ejecutando tool addToReadingList con:", { bookId, priority, notes });
    const result = await addToReadingListFn({ bookId, userId, priority, notes });
    console.log("✅ Resultado de addToReadingList:", result.message);
    return result;
  },
});

// Tool 3: Obtener lista de lectura
export const getReadingList = tool({
  description: "Obtiene la lista de lectura actual del usuario desde la base de datos.",
  parameters: z.object({
    userId: z.string().optional().default("demo-user"),
    limit: z.number().optional().default(10),
    order: z.enum(["asc", "desc"]).optional().default("desc"),
  }),
  execute: async ({ userId, limit, order }) => {
    console.log("🧠 Ejecutando tool getReadingList...");
    const result = await getReadingListFn({ userId, limit, order });
    console.log("✅ Resultados de getReadingList:", result.books?.length ?? 0);
    return result;
  },
});

// Tool 4: Marcar libro como leído
export const markAsRead = tool({
  description: "Marca un libro como leído, agregando calificación y reseña opcional. Devuelve un mensaje de confirmación que DEBES mostrar al usuario. NUNCA expongas parámetros técnicos como bookId o userId.",
  parameters: z.object({
    bookId: z.string().describe("ID único del libro en Google Books."),
    userId: z.string().optional().default("demo-user"),
    rating: z.number().min(1).max(5).optional(),
    review: z.string().optional(),
    dateFinished: z.string().optional(),
  }),
  execute: async ({ bookId, userId, rating, review, dateFinished }) => {
    console.log("🧠 Ejecutando tool markAsRead...");
    const result = await markAsReadFn({
      bookId,
      userId,
      rating,
      review,
      dateFinished: dateFinished ? new Date(dateFinished) : new Date(),
    });
    return result;
  },
});


// Tool 5: Obtener estadísticas de lectura
export const getReadingStats = tool({
  description: "Obtiene estadísticas de lectura del usuario, incluyendo total de libros leídos, promedio de rating, racha actual y desafíos personalizados. Usa 'challengeType' para especificar qué desafío mostrar: 'month' solo mes, 'year' solo año, 'all' todos los desafíos.",
  parameters: z.object({
    userId: z.string().optional().default("demo-user"),
    period: z.enum(["all-time", "year", "month", "week"]).optional().default("all-time"),
    challengeType: z.enum(["month", "year", "quality", "streak", "all"]).optional().default("all").describe("Tipo de desafío a mostrar: 'month' para mensual, 'year' para anual, 'all' para todos"),
  }),
  execute: async ({ userId, period, challengeType }) => {
    console.log("🧠 Ejecutando tool getReadingStats...");
    const result = await getReadingStatsFn({ userId, period, challengeType });
    console.log("✅ Stats generadas:", result);
    return result;
  },
});

// Tool 6: Obtener detalles de un libro
export const getBookDetails = tool({
  description: "Obtiene información detallada de un libro específico cuando el usuario pregunta sobre un libro en particular. Úsalo cuando el usuario dice 'cuéntame sobre ese libro', 'dame más información del libro X', 'qué tal es este libro', etc. Presenta solo la información del libro, NUNCA expongas el bookId al usuario.",
  parameters: z.object({
    bookId: z.string().describe("ID único del libro en Google Books."),
  }),
  execute: async ({ bookId }) => {
    console.log("🔍 Ejecutando tool getBookDetails con:", { bookId });
    const result = await getBookDetailsFn({ bookId });
    console.log("✅ Resultados de getBookDetails:", result);
    return result;
  },
});



// Registro global de tools
export const tools = { 
  searchBooks, 
  addToReadingList, 
  getReadingList, 
  markAsRead, 
  getReadingStats, 
  getBookDetails 
};
