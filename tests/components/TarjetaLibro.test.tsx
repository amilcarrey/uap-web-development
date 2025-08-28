import * as React from 'react'
import { render, screen } from '@testing-library/react'
import TarjetaLibro from '../../components/TarjetaLibro'

const libroMock = {
  id: '123',
  volumeInfo: {
    title: 'Mi Libro de Prueba',
    imageLinks: {
      thumbnail: 'http://example.com/thumb.jpg',
    },
  },
}

describe('TarjetaLibro', () => {
  it('renderiza título e imagen con https', () => {
    render(<TarjetaLibro libro={libroMock} />)

    expect(screen.getByText('Mi Libro de Prueba')).toBeInTheDocument()

    const img = screen.getByRole('img', { name: /mi libro de prueba/i })
    expect(img).toHaveAttribute('src', 'https://example.com/thumb.jpg')

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/libro/123')
  })

  it('usa imagen por defecto si no hay imagen', () => {
    const libroSinImagen = {
      id: '456',
      volumeInfo: {
        title: 'Libro sin Imagen',
      },
    }

    render(<TarjetaLibro libro={libroSinImagen} />)

    const img = screen.getByRole('img', { name: /libro sin imagen/i })
    expect(img).toHaveAttribute('src', '/default.png')
  })
})
