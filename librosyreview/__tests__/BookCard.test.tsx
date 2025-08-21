import { render, screen, fireEvent } from '@testing-library/react'
import BookCard from '../app/components/BookCard'

// Mock window.dispatchEvent at module level
const mockDispatchEvent = jest.fn()
Object.defineProperty(window, 'dispatchEvent', {
  value: mockDispatchEvent,
  writable: true
})

describe('BookCard', () => {
  const mockBook = {
    id: 'book1',
    title: 'Test Book',
    authors: ['Test Author'],
    thumbnail: 'http://example.com/thumb.jpg'
  }

  const mockBookWithoutThumbnail = {
    id: 'book2',
    title: 'Book Without Image',
    authors: ['Another Author']
  }

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks()
  })

  it('should render book information correctly', () => {
    render(<BookCard book={mockBook} />)
    
    expect(screen.getByText('Test Book')).toBeInTheDocument()
    expect(screen.getByText('Test Author')).toBeInTheDocument()
    expect(screen.getByText('Más Info')).toBeInTheDocument()
  })

  it('should render book image when thumbnail is provided', () => {
    render(<BookCard book={mockBook} />)
    
    const image = screen.getByAltText('Test Book')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'http://example.com/thumb.jpg')
  })

  it('should render placeholder when no thumbnail is provided', () => {
    render(<BookCard book={mockBookWithoutThumbnail} />)
    
    // Should not find an img element
    expect(screen.queryByAltText('Book Without Image')).not.toBeInTheDocument()
    // Find the SVG by its specific attributes instead of role
    const container = screen.getByText('Book Without Image').closest('.bg-white')
    const svgElement = container?.querySelector('svg')
    expect(svgElement).toBeInTheDocument()
    expect(svgElement).toHaveClass('w-16', 'h-16', 'text-amber-400')
  })

  it('should handle missing authors gracefully', () => {
    const bookWithoutAuthors = {
      id: 'book3',
      title: 'Book Without Authors',
      authors: []
    }
    
    render(<BookCard book={bookWithoutAuthors} />)
    
    expect(screen.getByText('Autor desconocido')).toBeInTheDocument()
  })

  it('should dispatch custom event when "Más Info" button is clicked', () => {
    render(<BookCard book={mockBook} />)
    
    const button = screen.getByText('Más Info')
    fireEvent.click(button)
    
    expect(mockDispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'openBookModal',
        detail: 'book1'
      })
    )
  })

  it('should join multiple authors with comma', () => {
    const bookWithMultipleAuthors = {
      id: 'book4',
      title: 'Multi Author Book',
      authors: ['Author One', 'Author Two', 'Author Three']
    }
    
    render(<BookCard book={bookWithMultipleAuthors} />)
    
    expect(screen.getByText('Author One, Author Two, Author Three')).toBeInTheDocument()
  })
})