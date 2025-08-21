export interface GoogleBook {
    id: string;
    volumeInfo: {
      title: string;
      authors?: string[];
      description?: string;
      imageLinks?: {
        smallThumbnail?: string;
        thumbnail?: string;
      };
      publishedDate?: string;
      pageCount?: number;
      categories?: string[];
    };
  }
  
  export async function searchBooks(query: string): Promise<GoogleBook[]> {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`
    );
    if (!res.ok) throw new Error("Error al buscar libros");
    const data = await res.json();
    return data.items || [];
  }
  
  export async function getBookById(id: string): Promise<GoogleBook | null> {
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`);
    if (!res.ok) return null;
    return await res.json();
  }
  