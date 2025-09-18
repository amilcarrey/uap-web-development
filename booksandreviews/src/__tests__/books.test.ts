import { describe, it, expect, vi, beforeEach } from 'vitest'
import { searchBooks, getBookById } from '../../app/actions/books'

describe('Funciones de Búsqueda de Libros', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('searchBooks', () => {
    it('debería retornar array vacío para query vacío', async () => {
      const result = await searchBooks('')
      expect(result).toEqual([])
    })

    it('debería retornar array vacío para query con solo espacios', async () => {
      const result = await searchBooks('   ')
      expect(result).toEqual([])
    })

    it('debería hacer fetch a la API de Google Books', async () => {
      const mockResponse = {
        items: [
          {
            id: 'test-id',
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

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await searchBooks('test query')

      expect(fetch).toHaveBeenCalledWith(
        'https://www.googleapis.com/books/v1/volumes?q=test%20query&maxResults=20',
        { cache: 'no-store' }
      )
      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Test Book')
    })

    it('debería manejar errores de la API', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false
      })

      const result = await searchBooks('test query')

      expect(result).toEqual([])
    })

    it('debería manejar respuesta sin items', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({})
      })

      const result = await searchBooks('test query')

      expect(result).toEqual([])
    })

    it('debería mapear correctamente los volúmenes a SimpleBook', async () => {
      const mockResponse = {
        items: [
          {
            id: 'test-id',
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

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await searchBooks('test query')

      expect(result[0]).toEqual({
        id: 'test-id',
        title: 'Test Book',
        authors: ['Test Author'],
        thumbnail: 'http://example.com/thumb.jpg'
      })
    })

    it('debería manejar volúmenes sin información completa', async () => {
      const mockResponse = {
        items: [
          {
            id: 'test-id',
            volumeInfo: {}
          }
        ]
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await searchBooks('test query')

      expect(result[0]).toEqual({
        id: 'test-id',
        title: 'Título desconocido',
        authors: [],
        thumbnail: undefined
      })
    })

    it('debería usar smallThumbnail si thumbnail no está disponible', async () => {
      const mockResponse = {
        items: [
          {
            id: 'test-id',
            volumeInfo: {
              title: 'Test Book',
              authors: ['Test Author'],
              imageLinks: {
                smallThumbnail: 'http://example.com/small-thumb.jpg'
              }
            }
          }
        ]
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await searchBooks('test query')

      expect(result[0].thumbnail).toBe('http://example.com/small-thumb.jpg')
    })
  })

  describe('getBookById', () => {
    it('debería retornar null para ID vacío', async () => {
      const result = await getBookById('')
      expect(result).toBeNull()
    })

    it('debería hacer fetch a la API para obtener libro por ID', async () => {
      const mockBook = {
        id: 'test-id',
        volumeInfo: {
          title: 'Test Book',
          authors: ['Test Author'],
          imageLinks: {
            thumbnail: 'http://example.com/thumb.jpg'
          },
          description: 'Test description',
          publishedDate: '2023-01-01',
          pageCount: 300,
          categories: ['Fiction'],
          publisher: 'Test Publisher',
          language: 'es'
        }
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockBook)
      })

      const result = await getBookById('test-id')

      expect(fetch).toHaveBeenCalledWith(
        'https://www.googleapis.com/books/v1/volumes/test-id',
        { cache: 'no-store' }
      )
      expect(result).toEqual({
        id: 'test-id',
        title: 'Test Book',
        authors: ['Test Author'],
        thumbnail: 'http://example.com/thumb.jpg',
        description: 'Test description',
        publishedDate: '2023-01-01',
        pageCount: 300,
        categories: ['Fiction'],
        publisher: 'Test Publisher',
        language: 'es'
      })
    })

    it('debería manejar errores de la API', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false
      })

      const result = await getBookById('test-id')

      expect(result).toBeNull()
    })

    it('debería mapear correctamente un volumen a DetailedBook', async () => {
      const mockBook = {
        id: 'test-id',
        volumeInfo: {
          title: 'Test Book',
          authors: ['Test Author'],
          imageLinks: {
            thumbnail: 'http://example.com/thumb.jpg'
          },
          description: 'Test description',
          publishedDate: '2023-01-01',
          pageCount: 300,
          categories: ['Fiction'],
          publisher: 'Test Publisher',
          language: 'es'
        }
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockBook)
      })

      const result = await getBookById('test-id')

      expect(result).toEqual({
        id: 'test-id',
        title: 'Test Book',
        authors: ['Test Author'],
        thumbnail: 'http://example.com/thumb.jpg',
        description: 'Test description',
        publishedDate: '2023-01-01',
        pageCount: 300,
        categories: ['Fiction'],
        publisher: 'Test Publisher',
        language: 'es'
      })
    })

    it('debería manejar volúmenes sin información detallada', async () => {
      const mockBook = {
        id: 'test-id',
        volumeInfo: {
          title: 'Test Book',
          authors: ['Test Author']
        }
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockBook)
      })

      const result = await getBookById('test-id')

      expect(result).toEqual({
        id: 'test-id',
        title: 'Test Book',
        authors: ['Test Author'],
        thumbnail: undefined,
        description: undefined,
        publishedDate: undefined,
        pageCount: undefined,
        categories: [],
        publisher: undefined,
        language: undefined
      })
    })
  })
})

