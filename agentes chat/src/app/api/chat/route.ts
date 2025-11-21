// import { convertToModelMessages, streamText, tool } from 'ai';
// import { client } from '../ai';
// import z from 'zod/v4';
// import { libro } from '@/app/types';
// import { error } from 'console';

// export async function POST(req: Request) {
//   const { messages } = await req.json();

//   const modelMessages = convertToModelMessages(messages)

//   try {
//     const result = streamText({
//       model: client('x-ai/grok-4.1-fast'),
//       system: `You are a helpful assistant. When you call a tool, after receiving the tool's output,
//               generate a final user-friendly response summarizing the results.`,
//       messages: modelMessages,

//       tools: {

//         searchBooks: {
//           description: 'Buscar libros en Google Books API por título, autor, tema, o palabras clave ',
//           inputSchema: z.object({
//             query: z.string().describe('El titulo, autor, tema, o palabra clave para buscar un libro'),
//             maxResults: z.number().default(10).describe('Numero de resultaos a retornar'),
//             orderBy: z.string().default('relevance').describe('Criterio de ordenamiento')
//           }),

//           execute: async ({ query, orderBy, maxResults }) => {
//             console.log(query);
//             console.log(orderBy)
//             const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=${maxResults}&orderBy=${orderBy}`);

//             if (!response.ok) return ({ error: 'Error al buscar en la API de Google' });

//             const data = await response.json();
//             console.log(data.items)
//             const books = data.items.map((b: libro) => ({
//               ID: b.id,
//               titulo: b.volumeInfo.title,
//               autor: b.volumeInfo.authors,
//               thumbnail: b.volumeInfo.imageLinks?.thumbnail ?? ''
//             }))
//             console.log('antes debooks')

//             if (books.length > 0) {
//               console.log(books)
//               return { books }
//             }
//           }
//         },

//         getBookDetails: {
//           description: 'Obtener información detallada de un libro específico usando su Google Books ID.',
//           inputSchema: z.object({
//             query: z.string().describe('El titulo, autor, tema, o palabra clave para buscar un libro'),
//             bookId: z.string().describe('ID unico de Google Books')
//           }),

//           execute: async ({ query, bookId}) => {
//             console.log(query);
//             console.log(bookId)
//             const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=id:${bookId}`);

//             if (!response.ok) return ({ error: 'Error al buscar en la API de Google',  });

//             const data = await response.json();
//             console.log(data)
//             console.log('antes debooks')


//               return { data }

//           }
//         }
//       }

//     });

//     return result.toUIMessageStreamResponse();

//   } catch (e) {
//     return e
//   }
// }


import { convertToModelMessages, streamText } from 'ai';
import { client } from '../ai';
import z from 'zod';
import db from '../../../../db'

const fetchBookMetadata = async (bookId: string) => {
  const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
  if (!response.ok) return null;
  const data = await response.json();
  return data.volumeInfo;
};

export async function POST(req: Request) {
  const { messages } = await req.json();

  const modelMessages = convertToModelMessages(messages);

  try {
    const result = streamText({
      model: client('x-ai/grok-4.1-fast:free'),
      system: "You are a helpful assistant.",
      messages: modelMessages,

      tools: {
        searchBooks: {
          description: 'Buscar libros en Google Books API',
          inputSchema: z.object({
            query: z.string(),
            maxResults: z.number().default(10),
            orderBy: z.string().default('relevance')
          }),

          execute: async ({ query, orderBy, maxResults }) => {
            const response = await fetch(
              `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=${maxResults}&orderBy=${orderBy}`
            );

            if (!response.ok)
              return { error: 'Error al buscar en la API de Google' };

            const data = await response.json();
            const items = data.items ?? [];

            const books = items.map((b: any) => ({
              ID: b.id,
              titulo: b.volumeInfo?.title,
              autor: b.volumeInfo?.authors,
              thumbnail: b.volumeInfo?.imageLinks?.thumbnail ?? ''
            }));

            return { books };
          }
        },

        getBookDetails: {
          description: 'Obtener detalles de un libro por ID',
          inputSchema: z.object({
            bookId: z.string()
          }),

          execute: async ({ bookId }) => {
            const response = await fetch(
              `https://www.googleapis.com/books/v1/volumes/${bookId}`
            );

            if (!response.ok)
              return { error: 'Error al buscar detalles del libro' };

            const data = await response.json();
            return { book: data };
          }
        },

        // Helper para obtener info completa antes de guardar (reutiliza lógica de Google Books)

        // ... dentro de tu objeto tools:

        addToReadingList: {
          description: 'Agregar un libro a la lista de lectura "Quiero Leer" guardando su metadata',
          inputSchema: z.object({
            bookId: z.string().describe('ID único del libro en Google Books'),
            priority: z.enum(['high', 'medium', 'low']).default('medium').describe('Prioridad de lectura'),
            notes: z.string().optional().describe('Notas personales sobre por qué quiere leerlo')
          }),
          execute: async ({ bookId, priority, notes }) => {
            try {
              // 1. Verificar si ya existe para no duplicar
              const existing = await db.collection('readingList').findOne({ bookId });
              if (existing) {
                return { message: 'El libro ya está en tu lista de lectura.' };
              }

              // 2. Obtener metadata de Google Books para poder hacer stats después
              const volumeInfo = await fetchBookMetadata(bookId);
              if (!volumeInfo) return { error: 'Libro no encontrado en Google Books' };

              // 3. Guardar en MongoDB
              const newEntry = {
                bookId,
                title: volumeInfo.title,
                authors: volumeInfo.authors || ['Desconocido'],
                pageCount: volumeInfo.pageCount || 0,
                categories: volumeInfo.categories || ['General'], // Géneros
                thumbnail: volumeInfo.imageLinks?.thumbnail || '',
                status: 'to-read',
                priority,
                notes,
                addedAt: new Date(),
              };

              await db.collection('readingList').insertOne(newEntry);

              return {
                success: true,
                message: `Libro "${volumeInfo.title}" agregado a la lista con prioridad ${priority}.`
              };
            } catch (error) {
              return { error: 'Error de base de datos al guardar el libro.' };
            }
          }
        },

        getReadingList: {
          description: 'Obtener libros pendientes por leer',
          inputSchema: z.object({
            filter: z.enum(['high', 'medium', 'low', 'oldest', 'newest']).optional(),
            limit: z.number().default(10)
          }),
          execute: async ({ filter, limit }) => {
            try {
              let query: any = { status: 'to-read' };
              let sort: any = { addedAt: -1 }; // Default: más recientes primero

              // Aplicar filtros simples
              if (filter === 'high' || filter === 'medium' || filter === 'low') {
                query.priority = filter;
              }
              if (filter === 'oldest') sort = { addedAt: 1 };

              const books = await db.collection('readingList')
                .find(query)
                .sort(sort)
                .limit(limit)
                .toArray();

              if (books.length === 0) return { message: "Tu lista de lectura está vacía." };

              return {
                count: books.length,
                books: books.map((b: any) => ({
                  id: b.bookId,
                  titulo: b.title,
                  autor: b.authors,
                  prioridad: b.priority,
                  agregado: b.addedAt
                }))
              };
            } catch (error) {
              return { error: 'Error al recuperar la lista.' };
            }
          }
        },

        markAsRead: {
          description: 'Marcar un libro como leído y guardar reseña',
          inputSchema: z.object({
            bookId: z.string(),
            rating: z.number().min(1).max(5).optional(),
            review: z.string().optional(),
            dateFinished: z.string().optional().describe('Fecha en formato YYYY-MM-DD')
          }),
          execute: async ({ bookId, rating, review, dateFinished }) => {
            try {
              const finishedAt = dateFinished ? new Date(dateFinished) : new Date();

              const result = await db.collection('readingList').updateOne(
                { bookId },
                {
                  $set: {
                    status: 'read',
                    finishedAt,
                    rating,
                    review
                  }
                }
              );

              if (result.matchedCount === 0) {
                return { error: 'El libro no se encontró en tu lista. Primero debes agregarlo.' };
              }

              return {
                success: true,
                message: '¡Felicidades! Libro marcado como leído.',
                details: { rating, review }
              };
            } catch (error) {
              return { error: 'Error al actualizar el libro.' };
            }
          }
        },

        getReadingStats: {
          description: 'Obtener estadísticas de lectura (libros leídos, páginas, géneros)',
          inputSchema: z.object({
            period: z.enum(['all-time', 'year', 'month']).default('all-time'),
            groupBy: z.enum(['genre', 'author']).optional()
          }),
          execute: async ({ period, groupBy }) => {
            try {
              // 1. Construir filtro de fecha
              let dateFilter: any = { status: 'read' };
              const now = new Date();

              if (period === 'year') {
                const startOfYear = new Date(now.getFullYear(), 0, 1);
                dateFilter.finishedAt = { $gte: startOfYear };
              } else if (period === 'month') {
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                dateFilter.finishedAt = { $gte: startOfMonth };
              }

              // 2. Obtener libros leídos
              const readBooks = await db.collection('readingList').find(dateFilter).toArray();

              if (readBooks.length === 0) {
                return { message: `No has leído libros en el periodo: ${period}` };
              }

              // 3. Calcular estadísticas básicas (Js reduce es más fácil que Mongo Aggregation para empezar)
              const totalBooks = readBooks.length;
              const totalPages = readBooks.reduce((acc: any, book: any) => acc + (book.pageCount || 0), 0);
              const averageRating = readBooks.reduce((acc: any, book: any) => acc + (book.rating || 0), 0) / (readBooks.filter((b: any) => b.rating).length || 1);

              // 4. Agrupación (Género o Autor)
              let distribution: Record<string, number> = {};
              if (groupBy) {
                readBooks.forEach((book: any) => {
                  const keys = groupBy === 'genre' ? book.categories : book.authors;
                  keys?.forEach((k: string) => {
                    distribution[k] = (distribution[k] || 0) + 1;
                  });
                });
              }

              // Ordenar la distribución para mostrar lo más popular
              const topStats = Object.entries(distribution)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3) // Top 3
                .map(([name, count]) => ({ name, count }));

              return {
                period,
                totalBooks,
                totalPages,
                averageRating: averageRating.toFixed(1),
                favorites: topStats.length > 0 ? topStats : undefined
              };

            } catch (error) {
              return { error: 'Error calculando estadísticas.' };
            }
          }
        }
      }
    });

    return result.toUIMessageStreamResponse();

  } catch (e) {
    console.error(e);
    return new Response("Internal error", { status: 500 });
  }
}
