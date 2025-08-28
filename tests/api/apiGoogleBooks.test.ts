import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Mock } from 'vitest'
import { buscarLibros } from '@/app/lib/apiGoogleBooks'

global.fetch = vi.fn() as Mock

const mockResponse = {
  items: [
    {
      id: '1',
      volumeInfo: {
        title: 'Libro de Prueba',
        authors: ['Autor X'],
        publishedDate: '2022',
      },
    },
  ],
}

describe('buscarLibros', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('devuelve una lista de libros correctamente', async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    const libros = await buscarLibros('prueba', 0, 10)

    expect(libros).toHaveLength(1)
    expect(libros[0].id).toBe('1')
    expect(libros[0].volumeInfo.title).toBe('Libro de Prueba')
  })

  it('devuelve un array vacío si fetch falla', async () => {
    (global.fetch as Mock).mockRejectedValueOnce(new Error('Network error'))

    const libros = await buscarLibros('error', 0, 10)

    expect(libros).toEqual([])
  })

  it('devuelve un array vacío si response no es ok', async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    })

    const libros = await buscarLibros('nook', 0, 10)

    expect(libros).toEqual([])
  })

  // --- Nuevos edge cases ---

  it('devuelve array vacío si la consulta es vacía o solo espacios', async () => {
    const libros = await buscarLibros('   ', 0, 10)
    expect(libros).toEqual([])
  })

  it('maneja correctamente respuesta sin propiedad items', async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}), // sin items
    })

    const libros = await buscarLibros('prueba', 0, 10)
    expect(libros).toEqual([])
  })

  it('maneja respuesta con items vacío', async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ items: [] }),
    })

    const libros = await buscarLibros('prueba', 0, 10)
    expect(libros).toEqual([])
  })

  it('maneja libros con datos incompletos', async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        items: [
          { id: '1', volumeInfo: null },
          { id: '2', volumeInfo: { title: null } },
        ],
      }),
    })

    const libros = await buscarLibros('prueba', 0, 10)
    expect(libros).toHaveLength(2)
    expect(libros[0].volumeInfo).toBeNull()
    expect(libros[1].volumeInfo.title).toBeNull()
  })

  it('maneja startIndex negativo devolviendo lista vacía', async () => {
    const libros = await buscarLibros('prueba', -10, 10)
    expect(libros).toEqual([])
  })
})
