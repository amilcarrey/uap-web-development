import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ReviewsSection from '../app/components/ReviewsSection'

// ✅ CORRECTO: Mock de localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
})

describe('ReviewsSection', () => {
  const mockReviews = [
    {
      id: 'review1',
      bookId: 'book1',
      bookTitle: 'Test Book 1',
      bookThumbnail: 'http://example.com/thumb1.jpg',
      rating: 5,
      content: 'Great book!',
      createdAt: '2023-01-01T00:00:00.000Z',
      likes: 2,
      dislikes: 0
    },
    {
      id: 'review2',
      bookId: 'book2',
      bookTitle: 'Test Book 2',
      bookThumbnail: 'http://example.com/thumb2.jpg', // Añadir thumbnail faltante
      rating: 3,
      content: 'Average book.',
      createdAt: '2023-01-02T00:00:00.000Z',
      likes: 1,
      dislikes: 1
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should show empty state when no reviews exist', async () => {
    mockLocalStorage.getItem.mockReturnValue(null)
    
    await act(async () => {
      render(<ReviewsSection />)
    })
    
    await waitFor(() => {
      expect(screen.getByText('Aún no has escrito reseñas')).toBeInTheDocument()
      expect(screen.getByText('Buscar libros para reseñar')).toBeInTheDocument()
    })
  })

  it('should load and display reviews from localStorage', async () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockReviews))
    
    await act(async () => {
      render(<ReviewsSection />)
    })

    await waitFor(() => {
      expect(screen.getByText('Mis Reseñas')).toBeInTheDocument()
      expect(screen.getByText('Test Book 1')).toBeInTheDocument()
      expect(screen.getByText('Test Book 2')).toBeInTheDocument()
      expect(screen.getByText('Great book!')).toBeInTheDocument()
      expect(screen.getByText('Average book.')).toBeInTheDocument()
    })
  })

  it('should display ratings correctly', async () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockReviews))
    
    await act(async () => {
      render(<ReviewsSection />)
    })

    await waitFor(() => {
      expect(screen.getByText('5★')).toBeInTheDocument()
      expect(screen.getByText('3★')).toBeInTheDocument()
    })
  })

  it('should handle like button click', async () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockReviews))
    
    await act(async () => {
      render(<ReviewsSection />)
    })

    await waitFor(() => {
      const likeButtons = screen.getAllByText('2')
      fireEvent.click(likeButtons[0].closest('button')!)
    })

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'book_reviews_v1',
      expect.stringContaining('"likes":3')
    )
  })

  it('should handle dislike button click', async () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockReviews))
    
    await act(async () => {
      render(<ReviewsSection />)
    })

    await waitFor(() => {
      const dislikeButtons = screen.getAllByText('0')
      fireEvent.click(dislikeButtons[0].closest('button')!)
    })

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'book_reviews_v1',
      expect.stringContaining('"dislikes":1')
    )
  })

  it('should handle localStorage parsing errors gracefully', async () => {
    mockLocalStorage.getItem.mockReturnValue('invalid json')
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    await act(async () => {
      render(<ReviewsSection />)
    })

    await waitFor(() => {
      expect(screen.getByText('Aún no has escrito reseñas')).toBeInTheDocument()
    })

    expect(consoleSpy).toHaveBeenCalledWith('Error loading reviews:', expect.any(Error))
    consoleSpy.mockRestore()
  })

  it('should display book thumbnails when available', async () => {
    const mockReviews = [
      {
        id: '1',
        bookId: 'book1',
        bookTitle: 'Test Book 1',
        bookThumbnail: 'http://example.com/thumb1.jpg',
        rating: 5,
        comment: 'Great book!',
        date: '2022-12-31',
        likes: 2,
        dislikes: 0
      },
      {
        id: '2',
        bookId: 'book2',
        bookTitle: 'Test Book 2',
        bookThumbnail: 'http://example.com/thumb2.jpg',
        rating: 3,
        comment: 'Okay book',
        date: '2023-01-01',
        likes: 1,
        dislikes: 1
      }
    ]
  
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => JSON.stringify(mockReviews)),
        setItem: vi.fn(),
      },
      writable: true
    })
  
    render(<ReviewsSection />)
  
    // Verificar que las imágenes están presentes con alt text correcto
    const image1 = screen.getByAltText('Test Book 1')
    const image2 = screen.getByAltText('Test Book 2')
    
    expect(image1).toBeInTheDocument()
    expect(image2).toBeInTheDocument()
    
    // Para Next.js Image, verificar que el src contiene la URL original
    expect(image1.getAttribute('src')).toContain('http%3A%2F%2Fexample.com%2Fthumb1.jpg')
    expect(image2.getAttribute('src')).toContain('http%3A%2F%2Fexample.com%2Fthumb2.jpg')
  })
})