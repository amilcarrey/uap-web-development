import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import BookCard from '../../app/components/BookCard'

// Mock de window.dispatchEvent
const mockDispatchEvent = vi.fn()
Object.defineProperty(window, 'dispatchEvent', {
  value: mockDispatchEvent,
  writable: true
})

describe('BookCard', () => {
  const mockBook = {
    id: 'test-id',
    title: 'Test Book Title',
    authors: ['Test Author 1', 'Test Author 2'],
    thumbnail: 'http://example.com/thumb.jpg'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debería renderizar la información del libro correctamente', () => {
    render(<BookCard book={mockBook} />)

    expect(screen.getByText('Test Book Title')).toBeInTheDocument()
    expect(screen.getByText('Test Author 1, Test Author 2')).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAttribute('src', 'http://example.com/thumb.jpg')
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Test Book Title')
  })

  it('debería mostrar placeholder cuando no hay thumbnail', () => {
    const bookWithoutThumbnail = { ...mockBook, thumbnail: undefined }
    render(<BookCard book={bookWithoutThumbnail} />)

    // Debería mostrar el SVG placeholder en lugar de una imagen
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.getByTestId('placeholder-icon')).toBeInTheDocument()
  })

  it('debería mostrar "Autor desconocido" cuando no hay autores', () => {
    const bookWithoutAuthors = { ...mockBook, authors: [] }
    render(<BookCard book={bookWithoutAuthors} />)

    expect(screen.getByText('Autor desconocido')).toBeInTheDocument()
  })

  it('debería disparar evento al hacer clic en "Más Info"', () => {
    render(<BookCard book={mockBook} />)

    const button = screen.getByText('Más Info')
    fireEvent.click(button)

    expect(mockDispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'openBookModal',
        detail: 'test-id'
      })
    )
  })

  it('debería tener las clases CSS correctas', () => {
    render(<BookCard book={mockBook} />)

    const card = screen.getByRole('article')
    expect(card).toHaveClass('bg-white', 'border', 'border-amber-200', 'rounded-lg')
  })

  it('debería mostrar el botón con el texto correcto', () => {
    render(<BookCard book={mockBook} />)

    const button = screen.getByRole('button', { name: 'Más Info' })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-amber-900', 'text-white')
  })
})
