import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import LibrosInteractivos from '@/app/LibrosInteractivos'
import { Libro } from '../../types/libro'
import * as apiGoogleBooks from '@/app/lib/apiGoogleBooks' 
import '@testing-library/jest-dom'

vi.mock('@/app/lib/apiGoogleBooks')

const mockedBuscarLibros = vi.mocked(apiGoogleBooks.buscarLibros)

const librosMock: Libro[] = [
  {
    id: '1',
    volumeInfo: {
      title: 'Harry Potter y la piedra filosofal',
      authors: ['J.K. Rowling'],
      publishedDate: '1997',
      description: 'Un joven mago va a Hogwarts.',
      imageLinks: {
        thumbnail: 'https://example.com/harry.jpg',
      },
    },
  },
]

describe('LibrosInteractivos', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renderiza libros iniciales correctamente', () => {
    render(<LibrosInteractivos librosIniciales={librosMock} />)
    const titulo = screen.getByText('Harry Potter y la piedra filosofal')
    expect(titulo).toBeInTheDocument()
  })

  it('muestra mensaje cuando no hay libros iniciales', () => {
    render(<LibrosInteractivos librosIniciales={[]} />)
    expect(screen.getByText(/no hay libros/i)).toBeInTheDocument()
  })

  it('carga más libros cuando se hace click en "Cargar más"', async () => {
    mockedBuscarLibros.mockResolvedValueOnce([
      {
        id: '2',
        volumeInfo: {
          title: 'El Hobbit',
          authors: ['J.R.R. Tolkien'],
          publishedDate: '1937',
          description: 'Una aventura épica.',
          imageLinks: {
            thumbnail: 'https://example.com/hobbit.jpg',
          },
        },
      },
    ])

    render(<LibrosInteractivos librosIniciales={librosMock} />)

    const boton = screen.getByText('Cargar más')
    await userEvent.click(boton)

    const nuevoLibro = await screen.findByText('El Hobbit')
    expect(nuevoLibro).toBeInTheDocument()
  })

  it('muestra alert o mensaje si la carga de más libros falla', async () => {
    mockedBuscarLibros.mockRejectedValueOnce(new Error('Error de red'))

    render(<LibrosInteractivos librosIniciales={librosMock} />)

    const boton = screen.getByText('Cargar más')
    await userEvent.click(boton)

    await waitFor(() => {
      expect(screen.getByText(/error al cargar/i)).toBeInTheDocument()
    })
  })

  it('deshabilita el botón "Cargar más" mientras carga', async () => {
    let resolver: (value: any) => void
    const promesaCarga = new Promise(resolve => { resolver = resolve })

    mockedBuscarLibros.mockImplementationOnce(() => promesaCarga)

    render(<LibrosInteractivos librosIniciales={librosMock} />)

    const boton = screen.getByText('Cargar más')
    expect(boton).toBeEnabled()

    userEvent.click(boton)

    await waitFor(() => {
      expect(boton).toBeDisabled()
    })

    resolver!([
      {
        id: '2',
        volumeInfo: {
          title: 'El Hobbit',
          authors: ['J.R.R. Tolkien'],
          publishedDate: '1937',
          description: 'Una aventura épica.',
          imageLinks: {
            thumbnail: 'https://example.com/hobbit.jpg',
          },
        },
      },
    ])

    const nuevoLibro = await screen.findByText('El Hobbit')
    expect(nuevoLibro).toBeInTheDocument()

    await waitFor(() => {
      expect(boton).toBeEnabled()
    })
  })

  
})
