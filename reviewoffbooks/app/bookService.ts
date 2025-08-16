import { GoogleBooksResponse, Book } from './types/index';

const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

export class BooksService {
  static async searchBooks(query: string, maxResults: number = 20): Promise<Book[]> {
    try {
      console.log('🔍 Buscando libros con query:', query);
      const response = await fetch(
        `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&maxResults=${maxResults}`
      );
      
      if (!response.ok) {
        throw new Error('Error al buscar libros');
      }
      
      const data: GoogleBooksResponse = await response.json();
      console.log('✅ Respuesta de API:', data.totalItems, 'libros encontrados');
      console.log('📚 Primer libro:', data.items?.[0]?.volumeInfo?.title);
      return data.items || [];
    } catch (error) {
      console.error('❌ Error buscando libros:', error);
      return [];
    }
  }

  static async getBookById(id: string): Promise<Book | null> {
    try {
      const response = await fetch(`${GOOGLE_BOOKS_API}/${id}`);
      
      if (!response.ok) {
        throw new Error('Libro no encontrado');
      }
      
      const book: Book = await response.json();
      return book;
    } catch (error) {
      console.error('Error obteniendo libro:', error);
      return null;
    }
  }

  static async searchByISBN(isbn: string): Promise<Book[]> {
    return this.searchBooks(`isbn:${isbn}`);
  }

  static async searchByAuthor(author: string): Promise<Book[]> {
    return this.searchBooks(`inauthor:${author}`);
  }
}