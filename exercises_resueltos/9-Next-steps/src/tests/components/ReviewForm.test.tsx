import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@/utils/test-utils'
import ReviewForm from '@/components/ReviewForm'

describe('ReviewForm', () => {
  const mockOnSubmit = vi.fn()
  const mockOnCancel = vi.fn()
  const defaultProps = {
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel,
    bookId: 'test-book-123',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders review form correctly', () => {
    render(<ReviewForm {...defaultProps} />)
    
    expect(screen.getByText('Escribe tu reseña')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Tu nombre')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Escribe tu reseña aquí...')).toBeInTheDocument()
    expect(screen.getByText('Enviar Reseña')).toBeInTheDocument()
    expect(screen.getByText('Cancelar')).toBeInTheDocument()
  })

  it('shows 5 star rating buttons', () => {
    render(<ReviewForm {...defaultProps} />)
    
    const stars = screen.getAllByText('★')
    expect(stars).toHaveLength(5)
  })

  it('allows selecting star rating', async () => {
    render(<ReviewForm {...defaultProps} />)
    
    const stars = screen.getAllByText('★')
    fireEvent.click(stars[2]) // Click on third star
    
    expect(stars[0]).toHaveClass('text-yellow-400')
    expect(stars[1]).toHaveClass('text-yellow-400')
    expect(stars[2]).toHaveClass('text-yellow-400')
    expect(stars[3]).toHaveClass('text-gray-300')
    expect(stars[4]).toHaveClass('text-gray-300')
  })

  it('shows validation error when submitting without rating', async () => {
    window.alert = vi.fn()
    render(<ReviewForm {...defaultProps} />)
    
    const submitButton = screen.getByText('Enviar Reseña')
    fireEvent.click(submitButton)
    
    expect(window.alert).toHaveBeenCalledWith('Por favor selecciona una calificación')
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('submits form with correct data', async () => {
    render(<ReviewForm {...defaultProps} />)
    
    // Fill out the form
    const nameInput = screen.getByPlaceholderText('Tu nombre')
    const commentInput = screen.getByPlaceholderText('Escribe tu reseña aquí...')
    const stars = screen.getAllByText('★')
    const submitButton = screen.getByText('Enviar Reseña')
    
    fireEvent.change(nameInput, { target: { value: 'Test User' } })
    fireEvent.change(commentInput, { target: { value: 'Great book!' } })
    fireEvent.click(stars[4]) // 5 stars
    fireEvent.click(submitButton)
    
    expect(mockOnSubmit).toHaveBeenCalledWith({
      bookId: 'test-book-123',
      author: 'Test User',
      rating: 5,
      comment: 'Great book!',
      date: expect.any(String),
    })
  })

  it('submits with anonymous author when name is empty', async () => {
    render(<ReviewForm {...defaultProps} />)
    
    const commentInput = screen.getByPlaceholderText('Escribe tu reseña aquí...')
    const stars = screen.getAllByText('★')
    const submitButton = screen.getByText('Enviar Reseña')
    
    fireEvent.change(commentInput, { target: { value: 'Great book!' } })
    fireEvent.click(stars[4]) // 5 stars
    fireEvent.click(submitButton)
    
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        author: 'Anónimo',
      })
    )
  })

  it('calls onCancel when cancel button is clicked', async () => {
    render(<ReviewForm {...defaultProps} />)
    
    const cancelButton = screen.getByText('Cancelar')
    fireEvent.click(cancelButton)
    
    expect(mockOnCancel).toHaveBeenCalled()
  })

  it('resets form after successful submission', async () => {
    render(<ReviewForm {...defaultProps} />)
    
    const nameInput = screen.getByPlaceholderText('Tu nombre')
    const commentInput = screen.getByPlaceholderText('Escribe tu reseña aquí...')
    const stars = screen.getAllByText('★')
    const submitButton = screen.getByText('Enviar Reseña')
    
    fireEvent.change(nameInput, { target: { value: 'Test User' } })
    fireEvent.change(commentInput, { target: { value: 'Great book!' } })
    fireEvent.click(stars[4])
    fireEvent.click(submitButton)
    
    // Form should be reset
    expect(nameInput).toHaveValue('')
    expect(commentInput).toHaveValue('')
    stars.forEach(star => {
      expect(star).toHaveClass('text-gray-300')
    })
  })
})