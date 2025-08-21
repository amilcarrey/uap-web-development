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

      const result = await searchBooks('test')
      expect(result).toEqual([])
    })

    // CASOS EXTREMOS EXHAUSTIVOS
    describe('Edge Cases', () => {
      it('should return empty array for empty query', async () => {
        const result = await searchBooks('')
        expect(result).toEqual([])
        expect(mockFetch).not.toHaveBeenCalled()
      })

      it('should return empty array for whitespace-only query', async () => {
        const result = await searchBooks('   \n\t   ')
        expect(result).toEqual([])
        expect(mockFetch).not.toHaveBeenCalled()
      })

      it('should handle null response', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => null
        } as Response)

        const result = await searchBooks('test')
        expect(result).toEqual([])
      })

      it('should handle undefined response', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => undefined
        } as Response)

        const result = await searchBooks('test')
        expect(result).toEqual([])
      })

      it('should handle malformed JSON response', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => { throw new Error('Invalid JSON') }
        } as Response)

        const result = await searchBooks('test')
        expect(result).toEqual([])
      })

      it('should handle response with non-array items', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ items: 'not an array' })
        } as Response)

        const result = await searchBooks('test')
        expect(result).toEqual([])
      })

      it('should handle response with empty items array', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ items: [] })
        } as Response)

        const result = await searchBooks('test')
        expect(result).toEqual([])
      })

      it('should handle HTTP 400 Bad Request', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 400,
          statusText: 'Bad Request'
        } as Response)

        const result = await searchBooks('test')
        expect(result).toEqual([])
      })

      it('should handle HTTP 401 Unauthorized', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 401,
          statusText: 'Unauthorized'
        } as Response)

        const result = await searchBooks('test')
        expect(result).toEqual([])
      })

      it('should handle HTTP 403 Forbidden', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 403,
          statusText: 'Forbidden'
        } as Response)

        const result = await searchBooks('test')
        expect(result).toEqual([])
      })

      it('should handle HTTP 429 Too Many Requests', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 429,
          statusText: 'Too Many Requests'
        } as Response)

        const result = await searchBooks('test')
        expect(result).toEqual([])
      })

      it('should handle HTTP 500 Internal Server Error', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error'
        } as Response)

        const result = await searchBooks('test')
        expect(result).toEqual([])
      })

      it('should handle HTTP 503 Service Unavailable', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 503,
          statusText: 'Service Unavailable'
        } as Response)

        const result = await searchBooks('test')
        expect(result).toEqual([])
      })

      it('should handle network timeout', async () => {
        mockFetch.mockRejectedValueOnce(new Error('Request timeout'))

        const result = await searchBooks('test')
        expect(result).toEqual([])
      })

      it('should handle DNS resolution failure', async () => {
        mockFetch.mockRejectedValueOnce(new Error('getaddrinfo ENOTFOUND'))

        const result = await searchBooks('test')
        expect(result).toEqual([])
      })

      it('should handle connection refused', async () => {
        mockFetch.mockRejectedValueOnce(new Error('connect ECONNREFUSED'))

        const result = await searchBooks('test')
        expect(result).toEqual([])
      })

      it('should handle special characters in query', async () => {
        const mockResponse = { items: [] }
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse
        } as Response)

        const result = await searchBooks('test@#$%^&*()+={}[]|\\:;"<>?,./~`')
        expect(result).toEqual([])
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining(encodeURIComponent('test@#$%^&*()+={}[]|\\:;"<>?,./~`')),
          expect.any(Object)
        )
      })

      it('should handle very long query strings', async () => {
        const longQuery = 'a'.repeat(10000)
        const mockResponse = { items: [] }
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse
        } as Response)

        const result = await searchBooks(longQuery)
        expect(result).toEqual([])
      })

      it('should handle Unicode characters in query', async () => {
        const mockResponse = { items: [] }
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse
        } as Response)

        const result = await searchBooks('测试 книга 📚 émojis')
        expect(result).toEqual([])
      })
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

    // CASOS EXTREMOS EXHAUSTIVOS
    describe('Edge Cases', () => {
      it('should return null for empty id', async () => {
        const result = await getBookById('')
        expect(result).toBeNull()
        expect(mockFetch).not.toHaveBeenCalled()
      })

      it('should handle null id', async () => {
        const result = await getBookById(null as any)
        expect(result).toBeNull()
        expect(mockFetch).not.toHaveBeenCalled()
      })

      it('should handle undefined id', async () => {
        const result = await getBookById(undefined as any)
        expect(result).toBeNull()
        expect(mockFetch).not.toHaveBeenCalled()
      })

      it('should handle malformed JSON response', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => { throw new Error('Invalid JSON') }
        } as Response)

        const result = await getBookById('book1')
        expect(result).toBeNull()
      })

      it('should handle null response data', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => null
        } as Response)

        const result = await getBookById('book1')
        expect(result).not.toBeNull() // mapVolumeToDetailed should handle null
      })

      it('should handle HTTP 400 Bad Request', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 400
        } as Response)

        const result = await getBookById('invalid-id')
        expect(result).toBeNull()
      })

      it('should handle HTTP 403 Forbidden', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 403
        } as Response)

        const result = await getBookById('book1')
        expect(result).toBeNull()
      })

      it('should handle HTTP 500 Internal Server Error', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 500
        } as Response)

        const result = await getBookById('book1')
        expect(result).toBeNull()
      })

      it('should handle network errors', async () => {
        mockFetch.mockRejectedValueOnce(new Error('Network error'))

        await expect(getBookById('book1')).rejects.toThrow('Network error')
      })

      it('should handle special characters in id', async () => {
        const mockResponse = { id: 'special@#$%', volumeInfo: {} }
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse
        } as Response)

        const result = await getBookById('special@#$%')
        expect(result).not.toBeNull()
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining(encodeURIComponent('special@#$%')),
          expect.any(Object)
        )
      })

      it('should handle very long id strings', async () => {
        const longId = 'a'.repeat(1000)
        const mockResponse = { id: longId, volumeInfo: {} }
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse
        } as Response)

        const result = await getBookById(longId)
        expect(result).not.toBeNull()
      })
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

      // CASOS EXTREMOS EXHAUSTIVOS
      describe('Edge Cases', () => {
        it('should handle null volume', () => {
          const result = mapVolumeToSimple(null)
          expect(result).toEqual({
            id: undefined,
            title: 'Título desconocido',
            authors: [],
            thumbnail: undefined
          })
        })

        it('should handle undefined volume', () => {
          const result = mapVolumeToSimple(undefined)
          expect(result).toEqual({
            id: undefined,
            title: 'Título desconocido',
            authors: [],
            thumbnail: undefined
          })
        })

        it('should handle volume without volumeInfo', () => {
          const volume = { id: 'book1' }
          const result = mapVolumeToSimple(volume)
          expect(result).toEqual({
            id: 'book1',
            title: 'Título desconocido',
            authors: [],
            thumbnail: undefined
          })
        })

        it('should handle null volumeInfo', () => {
          const volume = { id: 'book1', volumeInfo: null }
          const result = mapVolumeToSimple(volume)
          expect(result).toEqual({
            id: 'book1',
            title: 'Título desconocido',
            authors: [],
            thumbnail: undefined
          })
        })

        it('should handle missing title', () => {
          const volume = {
            id: 'book1',
            volumeInfo: {
              authors: ['Test Author']
            }
          }
          const result = mapVolumeToSimple(volume)
          expect(result.title).toBe('Título desconocido')
        })

        it('should handle null title', () => {
          const volume = {
            id: 'book1',
            volumeInfo: {
              title: null,
              authors: ['Test Author']
            }
          }
          const result = mapVolumeToSimple(volume)
          expect(result.title).toBe('Título desconocido')
        })

        it('should handle empty string title', () => {
          const volume = {
            id: 'book1',
            volumeInfo: {
              title: '',
              authors: ['Test Author']
            }
          }
          const result = mapVolumeToSimple(volume)
          expect(result.title).toBe('Título desconocido')
        })

        it('should handle missing authors', () => {
          const volume = {
            id: 'book1',
            volumeInfo: {
              title: 'Test Book'
            }
          }
          const result = mapVolumeToSimple(volume)
          expect(result.authors).toEqual([])
        })

        it('should handle null authors', () => {
          const volume = {
            id: 'book1',
            volumeInfo: {
              title: 'Test Book',
              authors: null
            }
          }
          const result = mapVolumeToSimple(volume)
          expect(result.authors).toEqual([])
        })

        it('should handle non-array authors', () => {
          const volume = {
            id: 'book1',
            volumeInfo: {
              title: 'Test Book',
              authors: 'Single Author'
            }
          }
          const result = mapVolumeToSimple(volume)
          expect(result.authors).toBe('Single Author')
        })

        it('should handle empty authors array', () => {
          const volume = {
            id: 'book1',
            volumeInfo: {
              title: 'Test Book',
              authors: []
            }
          }
          const result = mapVolumeToSimple(volume)
          expect(result.authors).toEqual([])
        })

        it('should prefer thumbnail over smallThumbnail', () => {
          const volume = {
            id: 'book1',
            volumeInfo: {
              title: 'Test Book',
              authors: ['Test Author'],
              imageLinks: {
                thumbnail: 'http://example.com/thumb.jpg',
                smallThumbnail: 'http://example.com/small.jpg'
              }
            }
          }
          const result = mapVolumeToSimple(volume)
          expect(result.thumbnail).toBe('http://example.com/thumb.jpg')
        })

        it('should use smallThumbnail when thumbnail is missing', () => {
          const volume = {
            id: 'book1',
            volumeInfo: {
              title: 'Test Book',
              authors: ['Test Author'],
              imageLinks: {
                smallThumbnail: 'http://example.com/small.jpg'
              }
            }
          }
          const result = mapVolumeToSimple(volume)
          expect(result.thumbnail).toBe('http://example.com/small.jpg')
        })

        it('should handle null imageLinks', () => {
          const volume = {
            id: 'book1',
            volumeInfo: {
              title: 'Test Book',
              authors: ['Test Author'],
              imageLinks: null
            }
          }
          const result = mapVolumeToSimple(volume)
          expect(result.thumbnail).toBeUndefined()
        })

        it('should handle missing imageLinks', () => {
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

        it('should handle very long titles', () => {
          const longTitle = 'A'.repeat(1000)
          const volume = {
            id: 'book1',
            volumeInfo: {
              title: longTitle,
              authors: ['Test Author']
            }
          }
          const result = mapVolumeToSimple(volume)
          expect(result.title).toBe(longTitle)
        })

        it('should handle special characters in title', () => {
          const specialTitle = 'Test@#$%^&*()+={}[]|\\:;"<>?,./~` 测试 📚'
          const volume = {
            id: 'book1',
            volumeInfo: {
              title: specialTitle,
              authors: ['Test Author']
            }
          }
          const result = mapVolumeToSimple(volume)
          expect(result.title).toBe(specialTitle)
        })

        it('should handle authors with special characters', () => {
          const volume = {
            id: 'book1',
            volumeInfo: {
              title: 'Test Book',
              authors: ['José María', 'François Müller', '李小明', 'O\'Connor']
            }
          }
          const result = mapVolumeToSimple(volume)
          expect(result.authors).toEqual(['José María', 'François Müller', '李小明', 'O\'Connor'])
        })
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

      // CASOS EXTREMOS EXHAUSTIVOS
      describe('Edge Cases', () => {
        it('should handle null volume', () => {
          const result = mapVolumeToDetailed(null)
          expect(result).toEqual({
            id: undefined,
            title: 'Título desconocido',
            authors: [],
            thumbnail: undefined,
            description: undefined,
            publishedDate: undefined,
            pageCount: undefined,
            categories: [],
            publisher: undefined,
            language: undefined
          })
        })

        it('should handle undefined volume', () => {
          const result = mapVolumeToDetailed(undefined)
          expect(result).toEqual({
            id: undefined,
            title: 'Título desconocido',
            authors: [],
            thumbnail: undefined,
            description: undefined,
            publishedDate: undefined,
            pageCount: undefined,
            categories: [],
            publisher: undefined,
            language: undefined
          })
        })

        it('should handle missing optional fields', () => {
          const volume = {
            id: 'book1',
            volumeInfo: {
              title: 'Minimal Book'
            }
          }
          const result = mapVolumeToDetailed(volume)
          expect(result).toEqual({
            id: 'book1',
            title: 'Minimal Book',
            authors: [],
            thumbnail: undefined,
            description: undefined,
            publishedDate: undefined,
            pageCount: undefined,
            categories: [],
            publisher: undefined,
            language: undefined
          })
        })

        it('should handle null optional fields', () => {
          const volume = {
            id: 'book1',
            volumeInfo: {
              title: 'Test Book',
              description: null,
              publishedDate: null,
              pageCount: null,
              publisher: null,
              language: null,
              categories: null
            }
          }
          const result = mapVolumeToDetailed(volume)
          expect(result.description).toBeNull()
          expect(result.publishedDate).toBeNull()
          expect(result.pageCount).toBeNull()
          expect(result.publisher).toBeNull()
          expect(result.language).toBeNull()
          expect(result.categories).toEqual([])
        })

        it('should handle negative page count', () => {
          const volume = {
            id: 'book1',
            volumeInfo: {
              title: 'Test Book',
              pageCount: -100
            }
          }
          const result = mapVolumeToDetailed(volume)
          expect(result.pageCount).toBe(-100)
        })

        it('should handle zero page count', () => {
          const volume = {
            id: 'book1',
            volumeInfo: {
              title: 'Test Book',
              pageCount: 0
            }
          }
          const result = mapVolumeToDetailed(volume)
          expect(result.pageCount).toBe(0)
        })

        it('should handle very large page count', () => {
          const volume = {
            id: 'book1',
            volumeInfo: {
              title: 'Test Book',
              pageCount: 999999
            }
          }
          const result = mapVolumeToDetailed(volume)
          expect(result.pageCount).toBe(999999)
        })

        it('should handle non-numeric page count', () => {
          const volume = {
            id: 'book1',
            volumeInfo: {
              title: 'Test Book',
              pageCount: 'not a number'
            }
          }
          const result = mapVolumeToDetailed(volume)
          expect(result.pageCount).toBe('not a number')
        })

        it('should handle empty categories array', () => {
          const volume = {
            id: 'book1',
            volumeInfo: {
              title: 'Test Book',
              categories: []
            }
          }
          const result = mapVolumeToDetailed(volume)
          expect(result.categories).toEqual([])
        })

        it('should handle non-array categories', () => {
          const volume = {
            id: 'book1',
            volumeInfo: {
              title: 'Test Book',
              categories: 'Fiction'
            }
          }
          const result = mapVolumeToDetailed(volume)
          expect(result.categories).toBe('Fiction')
        })

        it('should handle very long description', () => {
          const longDescription = 'A'.repeat(10000)
          const volume = {
            id: 'book1',
            volumeInfo: {
              title: 'Test Book',
              description: longDescription
            }
          }
          const result = mapVolumeToDetailed(volume)
          expect(result.description).toBe(longDescription)
        })

        it('should handle HTML in description', () => {
          const htmlDescription = '<p>This is a <strong>test</strong> description with <em>HTML</em> tags.</p>'
          const volume = {
            id: 'book1',
            volumeInfo: {
              title: 'Test Book',
              description: htmlDescription
            }
          }
          const result = mapVolumeToDetailed(volume)
          expect(result.description).toBe(htmlDescription)
        })

        it('should handle invalid date formats', () => {
          const volume = {
            id: 'book1',
            volumeInfo: {
              title: 'Test Book',
              publishedDate: 'invalid-date'
            }
          }
          const result = mapVolumeToDetailed(volume)
          expect(result.publishedDate).toBe('invalid-date')
        })

        it('should handle partial date formats', () => {
          const volume = {
            id: 'book1',
            volumeInfo: {
              title: 'Test Book',
              publishedDate: '2023'
            }
          }
          const result = mapVolumeToDetailed(volume)
          expect(result.publishedDate).toBe('2023')
        })

        it('should handle empty string fields', () => {
          const volume = {
            id: 'book1',
            volumeInfo: {
              title: 'Test Book',
              description: '',
              publisher: '',
              language: ''
            }
          }
          const result = mapVolumeToDetailed(volume)
          expect(result.description).toBe('')
          expect(result.publisher).toBe('')
          expect(result.language).toBe('')
        })
      })
    })
  })
})