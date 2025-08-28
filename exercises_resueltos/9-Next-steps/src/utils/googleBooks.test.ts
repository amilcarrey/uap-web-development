import { describe, it, expect, vi, beforeEach } from 'vitest';
import { searchBooks, getBookById, searchByType, isValidISBN } from './googleBooks';

// Mock global fetch
global.fetch = vi.fn();

describe('Google Books API', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('searchBooks', () => {
    it('should return empty array for empty query', async () => {
      const result = await searchBooks('');
      expect(result.books).toEqual([]);
      expect(result.totalItems).toBe(0);
      expect(result.hasMore).toBe(false);
      expect(result.actualTotal).toBe(0);
    });

    it('should handle API errors gracefully', async () => {
      (fetch as any).mockRejectedValue(new Error('API Error'));
      
      const result = await searchBooks('test');
      expect(result.books).toEqual([]);
      expect(result.totalItems).toBe(0);
      expect(result.hasMore).toBe(false);
      expect(result.actualTotal).toBe(0);
    });

    it('should parse response correctly', async () => {
      const mockResponse = {
        items: [
          {
            id: '1',
            volumeInfo: {
              title: 'Test Book',
              authors: ['Author 1'],
              description: 'Test description',
              imageLinks: {
                thumbnail: 'http://test.com/image.jpg'
              }
            }
          }
        ],
        totalItems: 1
      };

      (fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await searchBooks('test');
      expect(result.books).toHaveLength(1);
      expect(result.books[0].title).toBe('Test Book');
      expect(result.books[0].authors).toEqual(['Author 1']);
      expect(result.totalItems).toBe(1);
      expect(result.actualTotal).toBe(1);
      expect(result.hasMore).toBe(false);
    });

    it('should handle missing optional fields', async () => {
      const mockResponse = {
        items: [
          {
            id: '1',
            volumeInfo: {
              title: 'Test Book'
              // Missing authors, description, etc.
            }
          }
        ],
        totalItems: 1
      };

      (fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await searchBooks('test');
      expect(result.books[0].authors).toEqual(['Autor desconocido']);
      expect(result.books[0].description).toBe('Sin descripción disponible');
    });

    it('should handle large result sets with 1000 limit', async () => {
      const mockResponse = {
        items: Array(12).fill({
          id: '1',
          volumeInfo: {
            title: 'Test Book',
            authors: ['Author 1']
          }
        }),
        totalItems: 1500
      };

      (fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await searchBooks('test', { page: 1, limit: 12 });
      expect(result.totalItems).toBe(1500);
      expect(result.actualTotal).toBe(1000);
      expect(result.hasMore).toBe(true);
    });
  });

  describe('getBookById', () => {
    it('should return null for empty ID', async () => {
      const result = await getBookById('');
      expect(result).toBeNull();
    });

    it('should handle API errors', async () => {
      (fetch as any).mockRejectedValue(new Error('Not found'));
      
      const result = await getBookById('invalid');
      expect(result).toBeNull();
    });

    it('should return book details for valid ID', async () => {
      const mockResponse = {
        id: '123',
        volumeInfo: {
          title: 'Specific Book',
          authors: ['Specific Author'],
          description: 'Test description',
          imageLinks: {
            thumbnail: 'http://test.com/image.jpg'
          }
        }
      };

      (fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await getBookById('123');
      expect(result).toEqual({
        id: '123',
        title: 'Specific Book',
        authors: ['Specific Author'],
        description: 'Test description',
        imageLinks: {
          thumbnail: 'http://test.com/image.jpg'
        },
        publishedDate: undefined,
        categories: [],
        pageCount: undefined,
        averageRating: undefined,
        ratingsCount: undefined,
        industryIdentifiers: undefined
      });
    });
  });

  describe('searchByType', () => {
    it('should search by title', async () => {
      (fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ items: [], totalItems: 0 })
      });

      await searchByType('title', 'harry potter');
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('intitle:harry+potter')
      );
    });

    it('should search by author', async () => {
      (fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ items: [], totalItems: 0 })
      });

      await searchByType('author', 'rowling');
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('inauthor:rowling')
      );
    });

    it('should search by ISBN', async () => {
      (fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ items: [], totalItems: 0 })
      });

      await searchByType('isbn', '9780439708180');
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('isbn:9780439708180')
      );
    });

    it('should use general search for unknown type', async () => {
      (fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ items: [], totalItems: 0 })
      });

      await searchByType('general' as any, 'test');
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('q=test')
      );
    });
  });

  describe('isValidISBN', () => {
    it('should validate ISBN-10', () => {
      expect(isValidISBN('0-7475-3269-9')).toBe(true); // Harry Potter
      expect(isValidISBN('0471530189')).toBe(true); // Sin guiones
      expect(isValidISBN('invalid')).toBe(false);
    });

    it('should validate ISBN-13', () => {
      expect(isValidISBN('978-0-7475-3269-6')).toBe(true); // Harry Potter
      expect(isValidISBN('9780747532696')).toBe(true); // Sin guiones
      expect(isValidISBN('9780000000000')).toBe(false); // Inválido
    });

    it('should return false for invalid lengths', () => {
      expect(isValidISBN('123')).toBe(false);
      expect(isValidISBN('12345678901234')).toBe(false);
    });

    it('should handle ISBN with X check digit', () => {
      expect(isValidISBN('0-8044-2957-X')).toBe(true);
      expect(isValidISBN('080442957X')).toBe(true);
    });
  });
});