import { describe, it, expect, vi, beforeEach } from 'vitest'
import { searchBooks, getBookById, mapVolumeToSimple, mapVolumeToDetailed } from '../app/actions/books'

// Mock fetch
global.fetch = vi.fn()
const mockFetch = vi.mocked(fetch)

describe('Books API Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('searchBooks', () => {
    it('should return books when API call is successful', async () => {
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
        json: async () => mockResponse
      } as Response)

      const result = await searchBooks('test query')

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        id: 'book1',
        title: 'Test Book',
        authors: ['Test Author'],
        thumbnail: 'http://example.com/thumb.jpg'
      })
    })

    it('should return empty array when no items found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: undefined })
      } as Response)

      const result = await searchBooks('nonexistent')
      expect(result).toEqual([])
    })

    it('should handle API errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      // No debería lanzar el error, sino retornar un array vacío
      const result = await searchBooks('test')
      expect(result).toEqual([])
    })
  })

  describe('getBookById', () => {
    it('should return detailed book information', async () => {
      const mockResponse = {
        id: 'book1',
        volumeInfo: {
          title: 'Detailed Book',
          authors: ['Author One'],
          publishedDate: '2023-01-01',
          pageCount: 300,
          publisher: 'Test Publisher',
          language: 'en',
          categories: ['Fiction'],
          description: 'A test book description',
          imageLinks: {
            thumbnail: 'http://example.com/thumb.jpg'
          }
        }
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response)

      const result = await getBookById('book1')

      expect(result).toEqual({
        id: 'book1',
        title: 'Detailed Book',
        authors: ['Author One'],
        publishedDate: '2023-01-01',
        pageCount: 300,
        publisher: 'Test Publisher',
        language: 'en',
        categories: ['Fiction'],
        description: 'A test book description',
        thumbnail: 'http://example.com/thumb.jpg'
      })
    })

    it('should return null when book not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      } as Response)

      const result = await getBookById('nonexistent')
      expect(result).toBeNull()
    })
  })

  describe('Mapping Functions', () => {
    describe('mapVolumeToSimple', () => {
      it('should map volume to simple book format', () => {
        const volume = {
          id: 'book1',
          volumeInfo: {
            title: 'Test Book',
            authors: ['Test Author'],
            imageLinks: {
              thumbnail: 'http://example.com/thumb.jpg'
            }
          }
        }

        const result = mapVolumeToSimple(volume)

        expect(result).toEqual({
          id: 'book1',
          title: 'Test Book',
          authors: ['Test Author'],
          thumbnail: 'http://example.com/thumb.jpg'
        })
      })

      it('should handle missing thumbnail', () => {
        const volume = {
          id: 'book1',
          volumeInfo: {
            title: 'Test Book',
            authors: ['Test Author']
          }
        }

        const result = mapVolumeToSimple(volume)

        expect(result.thumbnail).toBeUndefined()
      })
    })

    describe('mapVolumeToDetailed', () => {
      it('should map volume to detailed book format', () => {
        const volume = {
          id: 'book1',
          volumeInfo: {
            title: 'Detailed Book',
            authors: ['Author One'],
            publishedDate: '2023-01-01',
            pageCount: 300,
            publisher: 'Test Publisher',
            language: 'en',
            categories: ['Fiction'],
            description: 'A test book description',
            imageLinks: {
              thumbnail: 'http://example.com/thumb.jpg'
            }
          }
        }

        const result = mapVolumeToDetailed(volume)

        expect(result).toEqual({
          id: 'book1',
          title: 'Detailed Book',
          authors: ['Author One'],
          publishedDate: '2023-01-01',
          pageCount: 300,
          publisher: 'Test Publisher',
          language: 'en',
          categories: ['Fiction'],
          description: 'A test book description',
          thumbnail: 'http://example.com/thumb.jpg'
        })
      })
    })
  })
})