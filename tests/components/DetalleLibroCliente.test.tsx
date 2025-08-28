import { render, screen, fireEvent } from '@testing-library/react'
import DetalleLibroCliente from '../../components/DetalleLibroCliente'
import { useRouter } from 'next/navigation'
import { vi } from 'vitest'

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}))

describe('DetalleLibroCliente', () => {
  const mockPush = vi.fn()
  const libroMock = {
    id: '1',
    volumeInfo: {
      title: 'Libro de prueba',
      authors: ['Autor Uno'],
      publishedDate: '2020',
      pageCount: 100,
      categories: ['Ficción', 'Aventura'],
      description: 'Descripción del libro',
      imageLinks: {
        thumbnail: 'https://example.com/portada.jpg',
      },
    },
  }
  const reseñasMock = [
    { id: 'r1', calificacion: 4, texto: 'Muy bueno' },
    { id: 'r2', calificacion: 5, texto: 'Excelente' },
  ]

  beforeEach(() => {
    (useRouter as vi.Mock).mockReturnValue({ push: mockPush })
  })

  it('renderiza título, autor y descripción', () => {
    render(<DetalleLibroCliente libro={libroMock} reseñasIniciales={reseñasMock} />)
    expect(screen.getByText('Libro de prueba')).toBeInTheDocument()
    expect(screen.getByText(/Autor Uno/)).toBeInTheDocument()
    expect(screen.getByText(/Descripción del libro/)).toBeInTheDocument()
  })

  it('botón regresar llama a router.push', () => {
    render(<DetalleLibroCliente libro={libroMock} reseñasIniciales={[]} />)
    fireEvent.click(screen.getByText('Regresar'))
    expect(mockPush).toHaveBeenCalledWith('/')
  })

  it('muestra estrellas amarillas y grises según promedio de reseñas', () => {
    render(<DetalleLibroCliente libro={libroMock} reseñasIniciales={reseñasMock} />)
    // Promedio 4.5 redondea a 5 estrellas amarillas, 0 grises
    const estrellasAmarillas = screen.getAllByText('★').filter(el => el.className.includes('text-yellow-400'))
    expect(estrellasAmarillas.length).toBe(5)
  })

  it('usa imagen por defecto si no hay imageLinks', () => {
    const libroSinImagen = { ...libroMock, volumeInfo: { ...libroMock.volumeInfo, imageLinks: undefined } }
    render(<DetalleLibroCliente libro={libroSinImagen} reseñasIniciales={[]} />)
    const img = screen.getByRole('img') as HTMLImageElement
    expect(img.src).toContain('Imagen_no_disponible.svg')
  })
})
