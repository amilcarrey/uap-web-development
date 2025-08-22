import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ReviewsSection from '../../app/components/ReviewsSection'

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

describe('ReviewsSection', () => {
  const mockReviews = [
    {
      id: '1',
      bookId: 'book-1',
      bookTitle: 'Test Book 1',
      bookThumbnail: 'http://example.com/thumb1.jpg',
      rating: 5,
      content: 'Excelente libro!',
      createdAt: '2023-01-01T00:00:00.000Z',
      likes: 2,
      dislikes: 0
    },
    {
      id: '2',
      bookId: 'book-2',
      bookTitle: 'Test Book 2',
      rating: 3,
      content: 'Libro regular',
      createdAt: '2023-01-02T00:00:00.000Z',
      likes: 0,
      dislikes: 1
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockReviews))
    localStorageMock.setItem.mockImplementation(() => {})
  })

  describe('Carga inicial', () => {
    it('debería cargar reseñas correctamente', () => {
      render(<ReviewsSection />)

      expect(screen.getByText('Test Book 1')).toBeInTheDocument()
      expect(screen.getByText('Test Book 2')).toBeInTheDocument()
    })

    it('debería cargar reseñas desde localStorage', async () => {
      render(<ReviewsSection />)

      await waitFor(() => {
        expect(screen.getByText('Test Book 1')).toBeInTheDocument()
        expect(screen.getByText('Test Book 2')).toBeInTheDocument()
      })
    })

    it('debería manejar errores al cargar reseñas', async () => {
      localStorageMock.getItem.mockReturnValue('invalid json')
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      render(<ReviewsSection />)

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error loading reviews:', expect.any(Error))
      })

      consoleSpy.mockRestore()
    })
  })

  describe('Estado vacío', () => {
    it('debería mostrar mensaje cuando no hay reseñas', async () => {
      localStorageMock.getItem.mockReturnValue(null)

      render(<ReviewsSection />)

      await waitFor(() => {
        expect(screen.getByText('Aún no has escrito reseñas')).toBeInTheDocument()
      })
    })

    it('debería mostrar enlace para buscar libros cuando no hay reseñas', async () => {
      localStorageMock.getItem.mockReturnValue(null)

      render(<ReviewsSection />)

      await waitFor(() => {
        const link = screen.getByText('Buscar libros para reseñar')
        expect(link).toBeInTheDocument()
        expect(link).toHaveAttribute('href', '/?view=search')
      })
    })
  })

  describe('Visualización de reseñas', () => {
    beforeEach(async () => {
      render(<ReviewsSection />)
      await waitFor(() => {
        expect(screen.getByText('Test Book 1')).toBeInTheDocument()
      })
    })

    it('debería mostrar el título de la sección', () => {
      expect(screen.getByText('Mis Reseñas')).toBeInTheDocument()
    })

    it('debería mostrar información completa de cada reseña', () => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument()
      expect(screen.getByText('Test Book 2')).toBeInTheDocument()
      expect(screen.getByText('Excelente libro!')).toBeInTheDocument()
      expect(screen.getByText('Libro regular')).toBeInTheDocument()
      expect(screen.getByText('5★')).toBeInTheDocument()
      expect(screen.getByText('3★')).toBeInTheDocument()
    })

    it('debería mostrar la imagen del libro cuando está disponible', () => {
      const image = screen.getByAltText('Test Book 1')
      expect(image).toHaveAttribute('src', 'http://example.com/thumb1.jpg')
    })

    it('debería mostrar fecha formateada correctamente', () => {
      // La fecha se formatea con toLocaleDateString, verificamos que esté presente
      expect(screen.getByText(/31\/12\/2022/)).toBeInTheDocument()
      expect(screen.getByText(/1\/1\/2023/)).toBeInTheDocument()
    })

    it('debería mostrar contadores de likes y dislikes', () => {
      expect(screen.getByText('2')).toBeInTheDocument() // likes del primer libro
      expect(screen.getAllByText('0')).toHaveLength(2) // dislikes del primer libro y likes del segundo
      expect(screen.getByText('1')).toBeInTheDocument() // dislikes del segundo libro
    })
  })

  describe('Interacción con likes y dislikes', () => {
    beforeEach(async () => {
      render(<ReviewsSection />)
      await waitFor(() => {
        expect(screen.getByText('Test Book 1')).toBeInTheDocument()
      })
    })

    it('debería incrementar likes al hacer clic en el botón like', async () => {
      const user = userEvent.setup()
      const likeButtons = screen.getAllByText('2') // Buscar el botón con el contador de likes
      const likeButton = likeButtons[0].closest('button')

      if (likeButton) {
        await user.click(likeButton)

        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'book_reviews_v1',
          expect.stringContaining('"likes":3')
        )
      }
    })

    it('debería incrementar dislikes al hacer clic en el botón dislike', async () => {
      const user = userEvent.setup()
      const dislikeButtons = screen.getAllByText('0') // Buscar el botón con el contador de dislikes
      const dislikeButton = dislikeButtons[0].closest('button')

      if (dislikeButton) {
        await user.click(dislikeButton)

        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'book_reviews_v1',
          expect.stringContaining('"dislikes":1')
        )
      }
    })

    it('debería actualizar el estado local después de like/dislike', async () => {
      const user = userEvent.setup()
      
      // Simular que localStorage devuelve datos actualizados
      const updatedReviews = [
        {
          ...mockReviews[0],
          likes: 3
        },
        mockReviews[1]
      ]
      
      localStorageMock.setItem.mockImplementation(() => {
        localStorageMock.getItem.mockReturnValue(JSON.stringify(updatedReviews))
      })

      const likeButtons = screen.getAllByText('2')
      const likeButton = likeButtons[0].closest('button')

      if (likeButton) {
        await user.click(likeButton)

        // Verificar que se actualizó el estado
        await waitFor(() => {
          expect(screen.getByText('3')).toBeInTheDocument() // Nuevo contador de likes
        })
      }
    })
  })

  describe('Manejo de errores', () => {
    it('debería manejar errores al cargar reseñas', async () => {
      localStorageMock.getItem.mockReturnValue('invalid json')
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      render(<ReviewsSection />)

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error loading reviews:', expect.any(Error))
      })

      consoleSpy.mockRestore()
    })
  })

  describe('Casos edge', () => {
    it('debería manejar reseñas sin thumbnail', async () => {
      const reviewsWithoutThumbnail = [
        {
          id: '1',
          bookId: 'book-1',
          bookTitle: 'Test Book',
          rating: 5,
          content: 'Great book!',
          createdAt: '2023-01-01T00:00:00.000Z'
        }
      ]

      localStorageMock.getItem.mockReturnValue(JSON.stringify(reviewsWithoutThumbnail))

      render(<ReviewsSection />)

      await waitFor(() => {
        expect(screen.getByText('Test Book')).toBeInTheDocument()
        expect(screen.queryByAltText('Test Book')).not.toBeInTheDocument()
      })
    })

    it('debería manejar reseñas sin likes/dislikes', async () => {
      const reviewsWithoutCounters = [
        {
          id: '1',
          bookId: 'book-1',
          bookTitle: 'Test Book',
          rating: 5,
          content: 'Great book!',
          createdAt: '2023-01-01T00:00:00.000Z'
        }
      ]

      localStorageMock.getItem.mockReturnValue(JSON.stringify(reviewsWithoutCounters))

      render(<ReviewsSection />)

      await waitFor(() => {
        expect(screen.getByText('Test Book')).toBeInTheDocument()
        expect(screen.getAllByText('0')).toHaveLength(2) // likes y dislikes
      })
    })

    it('debería manejar reseñas con contenido muy largo', async () => {
      const longContent = 'A'.repeat(1000)
      const reviewsWithLongContent = [
        {
          id: '1',
          bookId: 'book-1',
          bookTitle: 'Test Book',
          rating: 5,
          content: longContent,
          createdAt: '2023-01-01T00:00:00.000Z'
        }
      ]

      localStorageMock.getItem.mockReturnValue(JSON.stringify(reviewsWithLongContent))

      render(<ReviewsSection />)

      await waitFor(() => {
        expect(screen.getByText(longContent)).toBeInTheDocument()
      })
    })
  })
})
