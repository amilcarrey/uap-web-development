import { describe, it, expect, vi, beforeEach, type MockedFunction } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import Home from '../../app/page'
import { searchBooks } from '../../app/actions/books'

// Mock de las funciones de la API
vi.mock('../../app/actions/books', () => ({
  searchBooks: vi.fn()
}))

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

describe('Página Principal', () => {
  const mockBooks = [
    {
      id: '1',
      title: 'Test Book 1',
      authors: ['Author 1'],
      thumbnail: 'http://example.com/thumb1.jpg'
    },
    {
      id: '2',
      title: 'Test Book 2',
      authors: ['Author 2'],
      thumbnail: 'http://example.com/thumb2.jpg'
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    const mockSearchBooks = searchBooks as MockedFunction<typeof searchBooks>
    mockSearchBooks.mockResolvedValue([])
  })

  describe('Navegación', () => {
    it('debería mostrar el título principal', async () => {
      render(await Home({ searchParams: Promise.resolve({}) }))

      expect(screen.getByText('Books & Reviews')).toBeInTheDocument()
    })

    it('debería mostrar los enlaces de navegación', async () => {
      render(await Home({ searchParams: Promise.resolve({}) }))

      expect(screen.getByText('Inicio')).toBeInTheDocument()
      expect(screen.getByText('Buscar')).toBeInTheDocument()
      expect(screen.getByText('Mis Reseñas')).toBeInTheDocument()
    })

    it('debería marcar "Inicio" como activo por defecto', async () => {
      render(await Home({ searchParams: Promise.resolve({}) }))

      const inicioLink = screen.getByText('Inicio').closest('a')
      expect(inicioLink).toHaveClass('bg-amber-700')
    })

    it('debería marcar "Buscar" como activo cuando view=search', async () => {
      render(await Home({ searchParams: Promise.resolve({ view: 'search' }) }))

      const buscarLink = screen.getByText('Buscar').closest('a')
      expect(buscarLink).toHaveClass('bg-amber-700')
    })

    it('debería marcar "Mis Reseñas" como activo cuando view=reviews', async () => {
      render(await Home({ searchParams: Promise.resolve({ view: 'reviews' }) }))

      const reviewsLink = screen.getByText('Mis Reseñas').closest('a')
      expect(reviewsLink).toHaveClass('bg-amber-700')
    })
  })

  describe('Vista de Inicio', () => {
    it('debería mostrar el menú principal por defecto', async () => {
      render(await Home({ searchParams: Promise.resolve({}) }))

      expect(screen.getByText('¡Bienvenido a Books & Reviews!')).toBeInTheDocument()
      expect(screen.getByText('¿Qué puedes hacer?')).toBeInTheDocument()
    })

    it('debería mostrar las características principales', async () => {
      render(await Home({ searchParams: Promise.resolve({}) }))

      expect(screen.getByText('Explorar Biblioteca')).toBeInTheDocument()
      expect(screen.getByText('Compartir Opiniones')).toBeInTheDocument()
      expect(screen.getByText('Seguir Lecturas')).toBeInTheDocument()
    })
  })

  describe('Vista de Búsqueda', () => {
    it('debería mostrar el formulario de búsqueda cuando view=search', async () => {
      render(await Home({ searchParams: Promise.resolve({ view: 'search' }) }))

      const searchInput = screen.getByPlaceholderText('Busca por título, autor o ISBN...')
      expect(searchInput).toBeInTheDocument()
    })

    it('debería mostrar mensaje de instrucción cuando no hay query', async () => {
      render(await Home({ searchParams: Promise.resolve({ view: 'search' }) }))

      expect(screen.getByText('Ingresa un término de búsqueda para comenzar')).toBeInTheDocument()
    })

    it('debería realizar búsqueda cuando hay query', async () => {
      const mockSearchBooks = searchBooks as MockedFunction<typeof searchBooks>
      mockSearchBooks.mockResolvedValue(mockBooks)

      render(await Home({ searchParams: Promise.resolve({ view: 'search', q: 'test' }) }))

      await waitFor(() => {
        expect(mockSearchBooks).toHaveBeenCalledWith('test')
      })
    })

    it('debería mostrar resultados de búsqueda', async () => {
      const mockSearchBooks = searchBooks as MockedFunction<typeof searchBooks>
      mockSearchBooks.mockResolvedValue(mockBooks)

      render(await Home({ searchParams: Promise.resolve({ view: 'search', q: 'test' }) }))

      await waitFor(() => {
        expect(screen.getByText('Test Book 1')).toBeInTheDocument()
        expect(screen.getByText('Test Book 2')).toBeInTheDocument()
      })
    })

    it('debería mostrar mensaje cuando no hay resultados', async () => {
      const mockSearchBooks = searchBooks as MockedFunction<typeof searchBooks>
      mockSearchBooks.mockResolvedValue([])

      render(await Home({ searchParams: Promise.resolve({ view: 'search', q: 'nonexistent' }) }))

      await waitFor(() => {
        expect(screen.getByText('No se encontraron resultados :(')).toBeInTheDocument()
      })
    })

    it('debería mantener la vista de búsqueda cuando hay query activo', async () => {
      const mockSearchBooks = searchBooks as MockedFunction<typeof searchBooks>
      mockSearchBooks.mockResolvedValue(mockBooks)

      render(await Home({ searchParams: Promise.resolve({ q: 'test' }) }))

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Busca por título, autor o ISBN...')).toBeInTheDocument()
      })
    })
  })

  describe('Vista de Reseñas', () => {
    it('debería mostrar la sección de reseñas cuando view=reviews', async () => {
      render(await Home({ searchParams: Promise.resolve({ view: 'reviews' }) }))

      expect(screen.getByText('Mis Reseñas')).toBeInTheDocument()
    })
  })

  describe('Manejo de parámetros de búsqueda', () => {
    it('debería manejar query vacío', async () => {
      const mockSearchBooks = searchBooks as MockedFunction<typeof searchBooks>

      render(await Home({ searchParams: Promise.resolve({ q: '' }) }))

      expect(mockSearchBooks).not.toHaveBeenCalled()
    })

    it('debería manejar query con solo espacios', async () => {
      const mockSearchBooks = searchBooks as MockedFunction<typeof searchBooks>

      render(await Home({ searchParams: Promise.resolve({ q: '   ' }) }))

      expect(mockSearchBooks).not.toHaveBeenCalled()
    })

    it('debería manejar query undefined', async () => {
      const mockSearchBooks = searchBooks as MockedFunction<typeof searchBooks>

      render(await Home({ searchParams: Promise.resolve({}) }))

      expect(mockSearchBooks).not.toHaveBeenCalled()
    })

    it('debería manejar query con caracteres especiales', async () => {
      const mockSearchBooks = searchBooks as MockedFunction<typeof searchBooks>
      mockSearchBooks.mockResolvedValue(mockBooks)

      render(await Home({ searchParams: Promise.resolve({ q: 'test & books' }) }))

      await waitFor(() => {
        expect(mockSearchBooks).toHaveBeenCalledWith('test & books')
      })
    })
  })

  describe('Responsive Design', () => {
    it('debería tener clases CSS responsive para el grid de resultados', async () => {
      const mockSearchBooks = searchBooks as MockedFunction<typeof searchBooks>
      mockSearchBooks.mockResolvedValue(mockBooks)

      render(await Home({ searchParams: Promise.resolve({ view: 'search', q: 'test' }) }))

      await waitFor(() => {
        const grid = screen.getByText('Test Book 1').closest('div')?.parentElement?.parentElement
        expect(grid).toHaveClass('grid', 'grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3', 'xl:grid-cols-4')
      })
    })

    it('debería tener clases CSS responsive para el header', async () => {
      render(await Home({ searchParams: Promise.resolve({}) }))

      const header = screen.getByText('Books & Reviews').closest('header')
      expect(header).toHaveClass('bg-amber-900', 'text-white')
    })
  })

  describe('Integración con componentes', () => {
    it('debería renderizar BookModal', async () => {
      render(await Home({ searchParams: Promise.resolve({}) }))

      // El modal no debería estar visible inicialmente
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('debería renderizar BookCard cuando hay resultados', async () => {
      const mockSearchBooks = searchBooks as MockedFunction<typeof searchBooks>
      mockSearchBooks.mockResolvedValue(mockBooks)

      render(await Home({ searchParams: Promise.resolve({ view: 'search', q: 'test' }) }))

      await waitFor(() => {
        expect(screen.getByText('Test Book 1')).toBeInTheDocument()
        expect(screen.getByText('Author 1')).toBeInTheDocument()
      })
    })

    it('debería renderizar ReviewsSection cuando view=reviews', async () => {
      render(await Home({ searchParams: Promise.resolve({ view: 'reviews' }) }))

      expect(screen.getByText('Mis Reseñas')).toBeInTheDocument()
    })
  })

  describe('Casos edge', () => {
    it('debería manejar parámetros de búsqueda nulos', async () => {
      const mockSearchBooks = searchBooks as MockedFunction<typeof searchBooks>

      render(await Home({ searchParams: Promise.resolve({ q: null as any }) }))

      expect(mockSearchBooks).not.toHaveBeenCalled()
    })

    it('debería manejar parámetros de búsqueda undefined', async () => {
      const mockSearchBooks = searchBooks as MockedFunction<typeof searchBooks>

      render(await Home({ searchParams: Promise.resolve({ q: undefined }) }))

      expect(mockSearchBooks).not.toHaveBeenCalled()
    })

    it('debería manejar errores en la búsqueda', async () => {
      const mockSearchBooks = searchBooks as MockedFunction<typeof searchBooks>
      mockSearchBooks.mockResolvedValue([]) // En caso de error, la función retorna array vacío

      render(await Home({ searchParams: Promise.resolve({ view: 'search', q: 'test' }) }))

      await waitFor(() => {
        expect(screen.getByText('No se encontraron resultados :(')).toBeInTheDocument()
      })
    })
  })
})
