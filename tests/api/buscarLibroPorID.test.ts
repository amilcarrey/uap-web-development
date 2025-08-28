import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Mock } from 'vitest'
import { buscarLibroPorID } from '@/app/lib/apiGoogleBooks'

global.fetch = vi.fn() as Mock

const mockLibro = {
  id: '123',
  volumeInfo: {
    title: 'Libro de Ejemplo',
    authors: ['Autor A'],
    publishedDate: '2023',
  },
}

describe('buscarLibroPorID', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('devuelve el libro correctamente cuando fetch es exitoso', async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockLibro,
    })

    const libro = await buscarLibroPorID('123')

    expect(libro).toEqual(mockLibro)
  })

  it('devuelve null si fetch falla', async () => {
    (global.fetch as Mock).mockRejectedValueOnce(new Error('Network error'))

    const libro = await buscarLibroPorID('123')

    expect(libro).toBeNull()
  })

  it('devuelve null si la respuesta no es ok', async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({}),
    })

    const libro = await buscarLibroPorID('123')

    expect(libro).toBeNull()
  })

  // --- Nuevos edge cases ---

  it('devuelve null si el id es una cadena vacía', async () => {
    const libro = await buscarLibroPorID('')
    expect(libro).toBeNull()
  })

  it('maneja respuesta con datos incompletos', async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '123' }), // sin volumeInfo
    })

    const libro = await buscarLibroPorID('123')
    expect(libro).toEqual({ id: '123' })
  })

  it('maneja respuestas con status no 404 pero no ok', async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    })

    const libro = await buscarLibroPorID('123')
    expect(libro).toBeNull()
  })

  it('maneja retraso en fetch correctamente', async () => {
    (global.fetch as Mock).mockImplementationOnce(() =>
      new Promise(resolve =>
        setTimeout(() => {
          resolve({
            ok: true,
            json: async () => mockLibro,
          })
        }, 100)
      )
    )

    const libro = await buscarLibroPorID('123')
    expect(libro).toEqual(mockLibro)
  })
})
