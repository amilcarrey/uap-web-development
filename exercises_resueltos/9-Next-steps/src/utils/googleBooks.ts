import { Book, GoogleBooksResponse, PaginationParams, SearchBooksResponse } from '@/types';

export const searchBooks = async (
  query: string, 
  pagination?: PaginationParams
): Promise<SearchBooksResponse> => {
  try {
    // Si la query está vacía, retornar resultados vacíos
    if (!query.trim()) {
      return { books: [], totalItems: 0, hasMore: false, actualTotal: 0 };
    }

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
      title: item.volumeInfo.title || 'Sin título',
      authors: item.volumeInfo.authors || ['Autor desconocido'],
      publishedDate: item.volumeInfo.publishedDate,
      description: item.volumeInfo.description || 'Sin descripción disponible',
      imageLinks: item.volumeInfo.imageLinks,
      categories: item.volumeInfo.categories || [],
      pageCount: item.volumeInfo.pageCount,
      averageRating: item.volumeInfo.averageRating,
      ratingsCount: item.volumeInfo.ratingsCount,
      industryIdentifiers: item.volumeInfo.industryIdentifiers
    }));
    
    // Calcular el total real de resultados
    let actualTotal = data.totalItems;
    let hasMore = data.items.length === maxResults;
    
    // La API de Google Books tiene un límite de 1000 resultados
    if (data.totalItems > 1000) {
      actualTotal = 1000;
      hasMore = startIndex + maxResults < 1000;
    }
    
    // Si recibimos menos resultados de los solicitados, es la última página
    if (data.items.length < maxResults) {
      hasMore = false;
      actualTotal = startIndex + data.items.length;
    }
    
    return { 
      books, 
      totalItems: data.totalItems, // Total reportado por Google
      hasMore,
      actualTotal // Total real que podemos acceder
    };
  } catch (error) {
    console.error('Error searching books:', error);
    return { books: [], totalItems: 0, hasMore: false, actualTotal: 0 };
  }
};

export const getBookById = async (id: string): Promise<Book | null> => {
  try {
    if (!id) {
      return null;
    }

    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes/${id}`
    );
    
    if (!response.ok) {
      throw new Error('Error fetching book details');
    }
    
    const data = await response.json();
    
    return {
      id: data.id,
      title: data.volumeInfo.title || 'Sin título',
      authors: data.volumeInfo.authors || ['Autor desconocido'],
      publishedDate: data.volumeInfo.publishedDate,
      description: data.volumeInfo.description || 'Sin descripción disponible',
      imageLinks: data.volumeInfo.imageLinks,
      categories: data.volumeInfo.categories || [],
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

export const searchByType = async (
  type: 'title' | 'author' | 'isbn' | 'general',
  query: string,
  pagination?: PaginationParams
): Promise<SearchBooksResponse> => {
  let searchQuery = '';
  
  switch (type) {
    case 'title':
      searchQuery = `intitle:${query}`;
      break;
    case 'author':
      searchQuery = `inauthor:${query}`;
      break;
    case 'isbn':
      searchQuery = `isbn:${query}`;
      break;
    case 'general':
    default:
      searchQuery = query;
  }
  
  return searchBooks(searchQuery, pagination);
};

// Función para obtener libros populares (para la página principal)
export const getFeaturedBooks = async (): Promise<Book[]> => {
  try {
    const queries = [
      'best sellers fiction',
      'best sellers non fiction',
      'award winning books',
      'new releases'
    ];
    
    // Obtener algunos libros de cada categoría
    const allBooks: Book[] = [];
    
    for (const query of queries) {
      const { books } = await searchBooks(query, { limit: 3 });
      allBooks.push(...books);
    }
    
    // Mezclar y retornar máximo 12 libros
    return allBooks
      .sort(() => Math.random() - 0.5)
      .slice(0, 12)
      .filter((book, index, self) => 
        index === self.findIndex(b => b.id === book.id)
      );
  } catch (error) {
    console.error('Error getting featured books:', error);
    return [];
  }
};

// Función para validar ISBN
export const isValidISBN = (isbn: string): boolean => {
  // Eliminar guiones y espacios
  const cleanIsbn = isbn.replace(/[-\s]/g, '');
  
  // ISBN-10 o ISBN-13
  if (cleanIsbn.length === 10) {
    return isValidISBN10(cleanIsbn);
  } else if (cleanIsbn.length === 13) {
    return isValidISBN13(cleanIsbn);
  }
  
  return false;
};

const isValidISBN10 = (isbn: string): boolean => {
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    const digit = parseInt(isbn[i]);
    if (isNaN(digit)) return false;
    sum += (i + 1) * digit;
  }
  
  const lastChar = isbn[9].toUpperCase();
  if (lastChar === 'X') {
    sum += 10 * 10;
  } else {
    const digit = parseInt(lastChar);
    if (isNaN(digit)) return false;
    sum += 10 * digit;
  }
  
  return sum % 11 === 0;
};

const isValidISBN13 = (isbn: string): boolean => {
  if (!/^\d{13}$/.test(isbn)) return false;
  
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(isbn[i]);
    sum += (i % 2 === 0) ? digit : digit * 3;
  }
  
  const checkDigit = parseInt(isbn[12]);
  const calculatedCheckDigit = (10 - (sum % 10)) % 10;
  
  return checkDigit === calculatedCheckDigit;
};

// Función para formatear datos del libro
export const formatBookData = (book: Book): Book => {
  return {
    ...book,
    title: book.title || 'Sin título',
    authors: book.authors || ['Autor desconocido'],
    description: book.description || 'Sin descripción disponible',
    categories: book.categories || [],
    publishedDate: book.publishedDate ? new Date(book.publishedDate).getFullYear().toString() : undefined
  };
};

// Función para obtener múltiples libros por IDs
export const getBooksByIds = async (ids: string[]): Promise<Book[]> => {
  try {
    const books: Book[] = [];
    
    for (const id of ids) {
      const book = await getBookById(id);
      if (book) {
        books.push(book);
      }
    }
    
    return books;
  } catch (error) {
    console.error('Error getting books by IDs:', error);
    return [];
  }
};