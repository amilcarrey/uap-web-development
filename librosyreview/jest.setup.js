import '@testing-library/jest-dom'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
})

// Mock fetch
global.fetch = jest.fn()

// Mock window methods
Object.defineProperty(window, 'dispatchEvent', {
  value: jest.fn(),
  writable: true
})

Object.defineProperty(window, 'addEventListener', {
  value: jest.fn(),
  writable: true
})

Object.defineProperty(window, 'removeEventListener', {
  value: jest.fn(),
  writable: true
})

// Mock console methods to avoid noise in tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
}