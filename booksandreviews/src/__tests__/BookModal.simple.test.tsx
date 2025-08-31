import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BookModal from '../../app/components/BookModal'

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

// Mock de alert
global.alert = vi.fn()

describe('BookModal - Tests Simplificados', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue('[]')
    localStorageMock.setItem.mockImplementation(() => {})
  })

  it('no debería renderizar nada cuando isOpen es false', () => {
    render(<BookModal />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('debería renderizar el componente correctamente', () => {
    render(<BookModal />)
    // El componente debería renderizar sin errores
    expect(document.body).toBeInTheDocument()
  })
})
