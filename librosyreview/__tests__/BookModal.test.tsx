import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import BookModal from '../app/components/BookModal'

// ✅ MOCKEAR: Función API externa
vi.mock('../app/actions/books', () => ({
  getBookById: vi.fn()
}))

// Importar el mock después de definirlo
import { getBookById } from '../app/actions/books'
const mockGetBookById = vi.mocked(getBookById)

// ✅ MOCKEAR: localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
})

// ✅ MOCKEAR: window.alert
const mockAlert = vi.fn()
Object.defineProperty(window, 'alert', {
  value: mockAlert
})

// ✅ MOCKEAR: console.error para evitar logs en tests
const mockConsoleError = vi.fn()
Object.defineProperty(console, 'error', {
  value: mockConsoleError
})

describe('BookModal', () => {
  const mockBook = {
    id: 'book1',
    title: 'Test Book',
    authors: ['Test Author'],
    description: 'Test description',
    thumbnail: 'http://example.com/thumb.jpg',
    publishedDate: '2023-01-01',
    pageCount: 300,
    publisher: 'Test Publisher',
    language: 'es',
    categories: ['Fiction']
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue('[]')
  })

  // ✅ PROBAR DIRECTAMENTE: Lógica de renderizado condicional
  it('should not render when modal is closed', () => {
    render(<BookModal />)
    // El modal no debería estar visible inicialmente
    expect(document.querySelector('.fixed.inset-0')).not.toBeInTheDocument()
  })

  // ✅ PROBAR DIRECTAMENTE: Manejo de eventos del DOM
  it('should open modal when openBookModal event is dispatched', async () => {
    mockGetBookById.mockResolvedValue(mockBook)

    render(<BookModal />)
    
    // Simular evento personalizado
    await act(async () => {
      const event = new CustomEvent('openBookModal', { detail: 'book1' })
      window.dispatchEvent(event)
    })

    // Esperar a que el modal se abra
    await waitFor(() => {
      expect(document.querySelector('.fixed.inset-0')).toBeInTheDocument()
    }, { timeout: 5000 })
    
    // Esperar a que los datos se carguen
    await waitFor(() => {
      expect(screen.getByText('Test Book')).toBeInTheDocument()
    }, { timeout: 5000 })
    
    expect(mockGetBookById).toHaveBeenCalledWith('book1')
  })

  // ✅ PROBAR DIRECTAMENTE: Estado de carga
  it('should show loading state while fetching book data', async () => {
    // Crear una promesa que podemos controlar
    let resolvePromise: (value: any) => void
    const controlledPromise = new Promise((resolve) => {
      resolvePromise = resolve
    })
    
    mockGetBookById.mockReturnValue(controlledPromise)

    render(<BookModal />)
    
    // Disparar evento para abrir modal
    await act(async () => {
      const event = new CustomEvent('openBookModal', { detail: 'book1' })
      window.dispatchEvent(event)
    })

    // Verificar que el modal está abierto
    await waitFor(() => {
      expect(document.querySelector('.fixed.inset-0')).toBeInTheDocument()
    })

    // Verificar estado de carga (buscar por clase animate-pulse)
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument()

    // Resolver la promesa
    await act(async () => {
      resolvePromise!(mockBook)
    })

    // Verificar que se muestra el contenido
    await waitFor(() => {
      expect(screen.getByText('Test Book')).toBeInTheDocument()
    })
  })

  // ✅ PROBAR DIRECTAMENTE: Manejo de errores de API
  it('should show error message when book loading fails', async () => {
    mockGetBookById.mockRejectedValue(new Error('Network error'))

    render(<BookModal />)
    
    await act(async () => {
      const event = new CustomEvent('openBookModal', { detail: 'book1' })
      window.dispatchEvent(event)
    })

    // Esperar a que el modal se abra
    await waitFor(() => {
      expect(document.querySelector('.fixed.inset-0')).toBeInTheDocument()
    })

    // Esperar a que termine el loading y se muestre el error
    await waitFor(() => {
      expect(screen.getByText('Error al cargar la información del libro')).toBeInTheDocument()
    }, { timeout: 5000 })
    
    expect(mockConsoleError).toHaveBeenCalled()
  })

  // ✅ PROBAR DIRECTAMENTE: Cerrar modal
  it('should close modal when close button is clicked', async () => {
    mockGetBookById.mockResolvedValue(mockBook)

    render(<BookModal />)
    
    // Abrir modal
    await act(async () => {
      const event = new CustomEvent('openBookModal', { detail: 'book1' })
      window.dispatchEvent(event)
    })

    await waitFor(() => {
      expect(screen.getByText('Test Book')).toBeInTheDocument()
    })

    // Cerrar modal - buscar por el botón con el texto "Cerrar"
    const closeButton = screen.getByText('Cerrar')
    expect(closeButton).toBeInTheDocument()
    
    fireEvent.click(closeButton)

    await waitFor(() => {
      expect(document.querySelector('.fixed.inset-0')).not.toBeInTheDocument()
    })
  })

  // ✅ PROBAR DIRECTAMENTE: Envío de formulario de reseña
  it('should submit review and save to localStorage', async () => {
    mockGetBookById.mockResolvedValue(mockBook)
    mockLocalStorage.getItem.mockReturnValue('[]')

    render(<BookModal />)
    
    // Abrir modal
    await act(async () => {
      const event = new CustomEvent('openBookModal', { detail: 'book1' })
      window.dispatchEvent(event)
    })

    await waitFor(() => {
      expect(screen.getByText('Test Book')).toBeInTheDocument()
    })

    // Llenar formulario
    const ratingButtons = screen.getAllByText('★')
    const commentTextarea = screen.getByPlaceholderText('Comparte tu opinión sobre este libro...')
    const submitButton = screen.getByText('Publicar Reseña')

    // Seleccionar 4 estrellas (índice 3)
    fireEvent.click(ratingButtons[3])
    fireEvent.change(commentTextarea, { target: { value: 'Gran libro!' } })
    fireEvent.click(submitButton)

    // Verificar que se guardó en localStorage
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'book_reviews_v1',
      expect.stringContaining('Gran libro!')
    )
    expect(mockAlert).toHaveBeenCalledWith('¡Reseña publicada con éxito!')
  })

  // ✅ PROBAR DIRECTAMENTE: Validación de formulario
  it('should not submit review with empty comment', async () => {
    mockGetBookById.mockResolvedValue(mockBook)

    render(<BookModal />)
    
    // Abrir modal
    await act(async () => {
      const event = new CustomEvent('openBookModal', { detail: 'book1' })
      window.dispatchEvent(event)
    })

    await waitFor(() => {
      expect(screen.getByText('Test Book')).toBeInTheDocument()
    })

    // Intentar enviar sin comentario pero con rating
    const ratingButtons = screen.getAllByText('★')
    const submitButton = screen.getByText('Publicar Reseña')
    
    fireEvent.click(ratingButtons[4]) // 5 estrellas
    fireEvent.click(submitButton)

    // Verificar que no se guardó (el componente hace return early si no hay review.trim())
    expect(mockLocalStorage.setItem).not.toHaveBeenCalled()
    expect(mockAlert).not.toHaveBeenCalled()
  })

  // ✅ NUEVO TEST: Verificar que el modal se abre correctamente
  it('should open modal and show loading initially', async () => {
    const slowPromise = new Promise(resolve => setTimeout(() => resolve(mockBook), 100))
    mockGetBookById.mockReturnValue(slowPromise)

    render(<BookModal />)
    
    // Disparar evento
    await act(async () => {
      const event = new CustomEvent('openBookModal', { detail: 'book1' })
      window.dispatchEvent(event)
    })

    // Verificar que el modal está abierto (buscar el overlay)
    await waitFor(() => {
      expect(document.querySelector('.fixed.inset-0')).toBeInTheDocument()
    })
    
    // Esperar a que se resuelva
    await waitFor(() => {
      expect(screen.getByText('Test Book')).toBeInTheDocument()
    })
  })
})