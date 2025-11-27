import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock de localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Funciones de utilidad para reseñas
const REVIEWS_KEY = 'book_reviews_v1'

export interface Review {
  id: string
  bookId: string
  bookTitle: string
  bookThumbnail?: string
  rating: number
  content: string
  createdAt: string
  likes?: number
  dislikes?: number
}

export function saveReview(review: Omit<Review, 'id' | 'createdAt'>): Review {
  const newReview: Review = {
    ...review,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString()
  }

  const existingReviews = getReviews()
  existingReviews.unshift(newReview)
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(existingReviews))

  return newReview
}

export function getReviews(): Review[] {
  const savedReviews = localStorage.getItem(REVIEWS_KEY)
  if (!savedReviews) return []
  
  try {
    return JSON.parse(savedReviews)
  } catch (error) {
    console.error('Error loading reviews:', error)
    return []
  }
}

export function updateReviewLikes(reviewId: string, increment: number): Review[] {
  const reviews = getReviews()
  const updatedReviews = reviews.map(review => {
    if (review.id === reviewId) {
      return {
        ...review,
        likes: (review.likes || 0) + increment
      }
    }
    return review
  })
  
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(updatedReviews))
  return updatedReviews
}

export function updateReviewDislikes(reviewId: string, increment: number): Review[] {
  const reviews = getReviews()
  const updatedReviews = reviews.map(review => {
    if (review.id === reviewId) {
      return {
        ...review,
        dislikes: (review.dislikes || 0) + increment
      }
    }
    return review
  })
  
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(updatedReviews))
  return updatedReviews
}

describe('Funciones de Gestión de Reseñas', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
    localStorageMock.setItem.mockImplementation(() => {})
  })

  describe('getReviews', () => {
    it('debería retornar array vacío cuando no hay reseñas guardadas', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      const result = getReviews()
      
      expect(result).toEqual([])
      expect(localStorageMock.getItem).toHaveBeenCalledWith(REVIEWS_KEY)
    })

    it('debería retornar las reseñas guardadas correctamente', () => {
      const mockReviews = [
        {
          id: '1',
          bookId: 'book-1',
          bookTitle: 'Test Book',
          rating: 5,
          content: 'Great book!',
          createdAt: '2023-01-01T00:00:00.000Z'
        }
      ]
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockReviews))
      
      const result = getReviews()
      
      expect(result).toEqual(mockReviews)
    })

    it('debería manejar errores de JSON inválido', () => {
      localStorageMock.getItem.mockReturnValue('invalid json')
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      const result = getReviews()
      
      expect(result).toEqual([])
      expect(consoleSpy).toHaveBeenCalledWith('Error loading reviews:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })
  })

  describe('saveReview', () => {
    it('debería guardar una nueva reseña correctamente', () => {
      const mockReviews: Review[] = []
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockReviews))
      
      const reviewData = {
        bookId: 'book-1',
        bookTitle: 'Test Book',
        bookThumbnail: 'http://example.com/thumb.jpg',
        rating: 5,
        content: 'Great book!'
      }
      
      const result = saveReview(reviewData)
      
      expect(result).toMatchObject({
        bookId: 'book-1',
        bookTitle: 'Test Book',
        bookThumbnail: 'http://example.com/thumb.jpg',
        rating: 5,
        content: 'Great book!'
      })
      expect(result.id).toMatch(/^\d+-[a-z0-9]+$/)
      expect(result.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        REVIEWS_KEY,
        JSON.stringify([result])
      )
    })

    it('debería agregar la nueva reseña al inicio de la lista', () => {
      const existingReviews = [
        {
          id: '1',
          bookId: 'book-1',
          bookTitle: 'Old Book',
          rating: 3,
          content: 'Old review',
          createdAt: '2023-01-01T00:00:00.000Z'
        }
      ]
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingReviews))
      
      const reviewData = {
        bookId: 'book-2',
        bookTitle: 'New Book',
        rating: 5,
        content: 'New review'
      }
      
      const result = saveReview(reviewData)
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        REVIEWS_KEY,
        JSON.stringify([result, ...existingReviews])
      )
    })
  })

  describe('updateReviewLikes', () => {
    it('debería incrementar los likes de una reseña específica', () => {
      const mockReviews = [
        {
          id: '1',
          bookId: 'book-1',
          bookTitle: 'Test Book',
          rating: 5,
          content: 'Great book!',
          createdAt: '2023-01-01T00:00:00.000Z',
          likes: 2
        }
      ]
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockReviews))
      
      const result = updateReviewLikes('1', 1)
      
      expect(result[0].likes).toBe(3)
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        REVIEWS_KEY,
        JSON.stringify(result)
      )
    })

    it('debería inicializar likes en 0 si no existen', () => {
      const mockReviews = [
        {
          id: '1',
          bookId: 'book-1',
          bookTitle: 'Test Book',
          rating: 5,
          content: 'Great book!',
          createdAt: '2023-01-01T00:00:00.000Z'
        }
      ]
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockReviews))
      
      const result = updateReviewLikes('1', 1)
      
      expect(result[0].likes).toBe(1)
    })

    it('debería retornar la lista sin cambios si no encuentra la reseña', () => {
      const mockReviews = [
        {
          id: '1',
          bookId: 'book-1',
          bookTitle: 'Test Book',
          rating: 5,
          content: 'Great book!',
          createdAt: '2023-01-01T00:00:00.000Z',
          likes: 2
        }
      ]
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockReviews))
      
      const result = updateReviewLikes('non-existent', 1)
      
      expect(result).toEqual(mockReviews)
    })
  })

  describe('updateReviewDislikes', () => {
    it('debería incrementar los dislikes de una reseña específica', () => {
      const mockReviews = [
        {
          id: '1',
          bookId: 'book-1',
          bookTitle: 'Test Book',
          rating: 5,
          content: 'Great book!',
          createdAt: '2023-01-01T00:00:00.000Z',
          dislikes: 1
        }
      ]
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockReviews))
      
      const result = updateReviewDislikes('1', 1)
      
      expect(result[0].dislikes).toBe(2)
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        REVIEWS_KEY,
        JSON.stringify(result)
      )
    })

    it('debería inicializar dislikes en 0 si no existen', () => {
      const mockReviews = [
        {
          id: '1',
          bookId: 'book-1',
          bookTitle: 'Test Book',
          rating: 5,
          content: 'Great book!',
          createdAt: '2023-01-01T00:00:00.000Z'
        }
      ]
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockReviews))
      
      const result = updateReviewDislikes('1', 1)
      
      expect(result[0].dislikes).toBe(1)
    })
  })
})
