import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@/utils/test-utils'
import Home from '@/app/page'

describe('Book Flow Integration', () => {
  const mockBookData = {
    items: [
      {
        id: '1',
        volumeInfo: {
          title: 'Test Book',
          authors: ['Test Author'],
          publishedDate: '2023-01-01',
          description: 'Test description',
          imageLinks: { thumbnail: 'test.jpg' },
          industryIdentifiers: [{ identifier: '1234567890' }],
          pageCount: 200,
          categories: ['Fiction'],
        },
      },
    ],
  }

  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockBookData,
    })
  })

  it('completes full book search and review flow', async () => {
    render(<Home />)
    
    // Search for a book
    const searchInput = screen.getByPlaceholderText('Título del libro...')
    const searchButton = screen.getByRole('button', { name: 'Buscar' })
    
    fireEvent.change(searchInput, { target: { value: 'Test Book' } })
    fireEvent.click(searchButton)
    
    // Wait for results
    await waitFor(() => {
      expect(screen.getByText('Test Book')).toBeInTheDocument()
    })
    
    // Select a book
    const bookItem = screen.getByText('Test Book')
    fireEvent.click(bookItem)
    
    // Write a review
    const reviewButton = screen.getByText('Escribir Reseña')
    fireEvent.click(reviewButton)
    
    const commentInput = screen.getByPlaceholderText('Escribe tu reseña aquí...')
    const stars = screen.getAllByText('★')
    const submitButton = screen.getByText('Enviar Reseña')
    
    fireEvent.change(commentInput, { target: { value: 'Excellent book!' } })
    fireEvent.click(stars[4]) // 5 stars
    fireEvent.click(submitButton)
    
    // Verify review was added
    await waitFor(() => {
      expect(screen.getByText('Excellent book!')).toBeInTheDocument()
    })
  })

  it('handles empty search results', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ items: [] }),
    })
    
    render(<Home />)
    
    const searchInput = screen.getByPlaceholderText('Título del libro...')
    const searchButton = screen.getByRole('button', { name: 'Buscar' })
    
    fireEvent.change(searchInput, { target: { value: 'Nonexistent Book' } })
    fireEvent.click(searchButton)
    
    await waitFor(() => {
      expect(screen.getByText('No hay libros para mostrar')).toBeInTheDocument()
    })
  })

  it('handles API errors gracefully', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))
    
    render(<Home />)
    
    const searchInput = screen.getByPlaceholderText('Título del libro...')
    const searchButton = screen.getByRole('button', { name: 'Buscar' })
    
    fireEvent.change(searchInput, { target: { value: 'Test' } })
    fireEvent.click(searchButton)
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })
})