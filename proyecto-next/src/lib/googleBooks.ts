export interface BookVolumeInfo {
  title: string;
  authors?: string[];
  description?: string;
  imageLinks?: {
    thumbnail?: string;
    small?: string;
    medium?: string;
    large?: string;
  };
}

export interface Book {
  id: string;
  volumeInfo: BookVolumeInfo;
}

export interface SearchResult {
  kind: string;
  totalItems: number;
  items?: Book[];
}

export async function searchBooks(query: string): Promise<SearchResult> {
  const res = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`
  );
  if (!res.ok) throw new Error("Error buscando libros");
  const data = await res.json();
  return data;
}

export async function getBookById(id: string): Promise<Book | null> {
  try {
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`);
    if (!res.ok) return null;

    const data = await res.json();

    return {
      id: data.id,
      volumeInfo: {
        title: data.volumeInfo?.title ?? "Sin título",
        authors: data.volumeInfo?.authors ?? [],
        description: data.volumeInfo?.description ?? "Sin descripción",
        imageLinks: data.volumeInfo?.imageLinks ?? {},
      },
    };
  } catch (error) {
    console.error("Error getBookById:", error);
    return null;
  }
}
