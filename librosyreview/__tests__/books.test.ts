import { searchBooks, getBookById } from '../app/actions/books'

// Mock fetch globally
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

describe('Books Actions', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('searchBooks', () => {
    it('should return empty array for empty query', async () => {
      const result = await searchBooks('')
      expect(result).toEqual([])
    })

    it('should return empty array for whitespace query', async () => {
      const result = await searchBooks('   ')
      expect(result).toEqual([])
    })

    it('should return books for valid query', async () => {
      const mockResponse = {
        items: [
          {
            id: 'book1',
            volumeInfo: {
              title: 'Test Book',
              authors: ['Test Author'],
              imageLinks: {
                thumbnail: 'http://example.com/thumb.jpg'
              }
            }
          }
        ]
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await searchBooks('test')
      
      expect(mockFetch).toHaveBeenCalledWith(
        'https://www.googleapis.com/books/v1/volumes?q=test&maxResults=20',
        { cache: 'no-store' }
      )
      expect(result).toEqual([
        {
          id: 'book1',
          title: 'Test Book',
          authors: ['Test Author'],
          thumbnail: 'http://example.com/thumb.jpg'
        }
      ])
    })

    it('should handle API errors gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      } as Response)

      const result = await searchBooks('test')
      expect(result).toEqual([])
    })

    it('should handle missing volumeInfo', async () => {
      const mockResponse = {
        items: [
          {
            id: 'book1',
            // volumeInfo is missing
          }
        ]
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await searchBooks('test')
      
      expect(result).toEqual([
        {
          id: 'book1',
          title: 'Título desconocido',
          authors: [],
          thumbnail: undefined
        }
      ])
    })

    it('should handle missing items array', async () => {
      const mockResponse = {
        // items is missing
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await searchBooks('test')
      expect(result).toEqual([])
    })
  })

  describe('getBookById', () => {
    it('should return null for empty id', async () => {
      const result = await getBookById('')
      expect(result).toBeNull()
    })

    it('should return detailed book for valid id', async () => {
      const mockResponse = {
        id: 'book1',
        volumeInfo: {
          title: 'Test Book',
          authors: ['Test Author'],
          description: 'Test description',
          publishedDate: '2023-01-01',
          pageCount: 200,
          categories: ['Fiction'],
          publisher: 'Test Publisher',
          language: 'es',
          imageLinks: {
            thumbnail: 'http://example.com/thumb.jpg'
          }
        }
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await getBookById('book1')
      
      expect(mockFetch).toHaveBeenCalledWith(
        'https://www.googleapis.com/books/v1/volumes/book1',
        { cache: 'no-store' }
      )
      expect(result).toEqual({
        id: 'book1',
        title: 'Test Book',
        authors: ['Test Author'],
        thumbnail: 'http://example.com/thumb.jpg',
        description: 'Test description',
        publishedDate: '2023-01-01',
        pageCount: 200,
        categories: ['Fiction'],
        publisher: 'Test Publisher',
        language: 'es'
      })
    })

    it('should handle API errors gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      } as Response)

      const result = await getBookById('book1')
      expect(result).toBeNull()
    })
  })
})