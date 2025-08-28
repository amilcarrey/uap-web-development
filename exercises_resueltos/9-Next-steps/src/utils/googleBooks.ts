import { Book, GoogleBooksResponse, PaginationParams, SearchBooksResponse } from '@/types';

export const searchBooks = async (
  query: string, 
  pagination?: PaginationParams
): Promise<SearchBooksResponse> => {
  try {
    const startIndex = pagination?.page && pagination?.limit 
      ? (pagination.page - 1) * pagination.limit 
      : 0;
    
    const maxResults = pagination?.limit || 12;
    
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&startIndex=${startIndex}&maxResults=${maxResults}`
    );
    
    if (!response.ok) {
      throw new Error('Error fetching books');
    }
    
    const data: GoogleBooksResponse = await response.json();
    
    if (!data.items) {
      return { books: [], totalItems: 0, hasMore: false, actualTotal: 0 };
    }
    
    const books = data.items.map(item => ({
      id: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors,
      publishedDate: item.volumeInfo.publishedDate,
      description: item.volumeInfo.description,
      imageLinks: item.volumeInfo.imageLinks,
      categories: item.volumeInfo.categories,
      pageCount: item.volumeInfo.pageCount,
      averageRating: item.volumeInfo.averageRating,
      ratingsCount: item.volumeInfo.ratingsCount,
      industryIdentifiers: item.volumeInfo.industryIdentifiers
    }));
    
    // Detectar si hay más resultados
    const hasMore = data.items.length === maxResults && 
                   startIndex + maxResults < data.totalItems &&
                   startIndex + maxResults < 1000; // Límite de la API
    
    // Calcular el total real (mínimo entre el total reportado y 1000)
    const actualTotal = Math.min(data.totalItems, 1000);
    
    return { 
      books, 
      totalItems: actualTotal,
      hasMore,
      actualTotal
    };
  } catch (error) {
    console.error('Error searching books:', error);
    return { books: [], totalItems: 0, hasMore: false, actualTotal: 0 };
  }
};

export const getBookById = async (id: string): Promise<Book | null> => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes/${id}`
    );
    
    if (!response.ok) {
      throw new Error('Error fetching book details');
    }
    
    const data = await response.json();
    
    return {
      id: data.id,
      title: data.volumeInfo.title,
      authors: data.volumeInfo.authors,
      publishedDate: data.volumeInfo.publishedDate,
      description: data.volumeInfo.description,
      imageLinks: data.volumeInfo.imageLinks,
      categories: data.volumeInfo.categories,
      pageCount: data.volumeInfo.pageCount,
      averageRating: data.volumeInfo.averageRating,
      ratingsCount: data.volumeInfo.ratingsCount,
      industryIdentifiers: data.volumeInfo.industryIdentifiers
    };
  } catch (error) {
    console.error('Error fetching book:', error);
    return null;
  }
};