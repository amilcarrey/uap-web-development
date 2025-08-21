import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
})

// Mock fetch
global.fetch = vi.fn()

// Mock window methods
Object.defineProperty(window, 'dispatchEvent', {
  value: vi.fn(),
  writable: true
})

// Mock CustomEvent
global.CustomEvent = vi.fn().mockImplementation((type, options) => ({
  type,
  detail: options?.detail,
  bubbles: options?.bubbles || false,
  cancelable: options?.cancelable || false
}))