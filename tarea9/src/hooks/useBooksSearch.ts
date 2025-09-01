import { useState, useEffect } from "react";

export interface Book {
  id: string;
  title: string;
  authors: string[];
  publishedDate?: string;
  description?: string;
  thumbnail?: string;
}

interface UseBooksSearchResult {
  books: Book[];
  loading: boolean;
  error: string | null;
}

export function useBooksSearch(query: string): UseBooksSearchResult {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setBooks([]);
      setError(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Error al buscar libros");
        return res.json();
      })
      .then((data) => {
        const items = data.items || [];
        setBooks(
          items.map((item: any) => ({
            id: item.id,
            title: item.volumeInfo.title,
            authors: item.volumeInfo.authors || [],
            publishedDate: item.volumeInfo.publishedDate,
            description: item.volumeInfo.description,
            thumbnail: item.volumeInfo.imageLinks?.thumbnail,
          }))
        );
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [query]);

  return { books, loading, error };
}
