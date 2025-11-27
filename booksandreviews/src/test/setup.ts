import '@testing-library/jest-dom'
import { vi, afterEach } from 'vitest'

// Mock de localStorage para los tests
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock de fetch para simular llamadas a la API
global.fetch = vi.fn()

// Limpiar todos los mocks después de cada test
afterEach(() => {
  vi.clearAllMocks()
})
