import { it, expect, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import SearchPage from '../pages/SearchPage'

const qc = new QueryClient()

vi.stubGlobal('fetch', vi.fn(async () => ({
  ok: true,
  json: async () => [{ id: 'x1', title: 'Libro X' }], // datos fake para la lista
})) as any)

it('busca y lista resultados', async () => {
  render(
    <MemoryRouter>
      <QueryClientProvider client={qc}>
        <SearchPage />
      </QueryClientProvider>
    </MemoryRouter>
  )

  // dispara la búsqueda (el componente también busca al montar)
  fireEvent.click(screen.getByText(/buscar/i))

  await waitFor(() => {
    expect(screen.getByText('Libro X')).toBeInTheDocument()
  })
})
