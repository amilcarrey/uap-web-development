/**
 * searchBooks - Buscar libros en Google Books API por título, autor, tema, o palabras clave.
 * 
 * Cuándo se usa:
 * - "Recomiéndame libros sobre inteligencia artificial"
 * - "Busca novelas de Gabriel García Márquez"
 * - "Quiero leer sobre historia romana"
 * 
 * @param query - String de búsqueda
 * @param maxResults - Número de resultados a retornar (opcional, default: 10)
 * @param orderBy - Criterio de ordenamiento (relevance, newest)
 * @returns Lista de libros con información básica (título, autor, thumbnail, ID)
 */
export async function searchBooks({ query, maxResults = 10, orderBy = "relevance" }) {
  if (!query || typeof query !== "string") throw new Error("Invalid query");

  const res = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=${maxResults}&orderBy=${orderBy}&key=${process.env.GOOGLE_BOOKS_API_KEY}`
  );

  if (!res.ok) throw new Error("Failed to fetch from Google Books API");

  const data = await res.json();

  // Retorna solo información básica: título, autor, thumbnail, ID
  return (
    data.items?.map((b: any) => ({
      id: b.id,
      title: b.volumeInfo.title,
      authors: b.volumeInfo.authors || [],
      thumbnail: b.volumeInfo.imageLinks?.thumbnail,
    })) ?? []
  );
}
