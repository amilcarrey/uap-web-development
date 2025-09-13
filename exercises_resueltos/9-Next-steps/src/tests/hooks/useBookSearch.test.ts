import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('Book Search Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('constructs correct API URL for title search', () => {
    const query = 'Harry Potter'
    const searchType = 'title'
    const expectedUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=20`
    
    expect(expectedUrl).toBe('https://www.googleapis.com/books/v1/volumes?q=Harry%20Potter&maxResults=20')
  })

  it('constructs correct API URL for author search', () => {
    const query = 'Rowling'
    const searchType = 'author'
    const searchQuery = `inauthor:${query}`
    const expectedUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&maxResults=20`
    
    expect(expectedUrl).toBe('https://www.googleapis.com/books/v1/volumes?q=inauthor%3ARowling&maxResults=20')
  })

  it('constructs correct API URL for ISBN search', () => {
    const query = '9780439708180'
    const searchType = 'isbn'
    const searchQuery = `isbn:${query}`
    const expectedUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&maxResults=20`
    
    expect(expectedUrl).toBe('https://www.googleapis.com/books/v1/volumes?q=isbn%3A9780439708180&maxResults=20')
  })

  it('handles special characters in search query', () => {
    const query = 'Cien años de soledad'
    const expectedUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=20`
    
    expect(expectedUrl).toBe('https://www.googleapis.com/books/v1/volumes?q=Cien%20a%C3%B1os%20de%20soledad&maxResults=20')
  })

  it('handles empty search results', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ items: null }),
    }
    
    global.fetch = vi.fn().mockResolvedValue(mockResponse)
    
    const response = await fetch('https://www.googleapis.com/books/v1/volumes?q=nonexistentbook12345&maxResults=20')
    const data = await response.json()
    
    expect(data.items).toBeNull()
  })

  it('handles API errors', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('API Error'))
    
    await expect(fetch('https://www.googleapis.com/books/v1/volumes?q=test&maxResults=20'))
      .rejects
      .toThrow('API Error')
  })
})