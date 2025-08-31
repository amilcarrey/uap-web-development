import { describe, it, expect } from 'vitest'

// Funciones de utilidad para validaciones
export function validateReviewData(data: {
  bookId?: string
  bookTitle?: string
  rating?: number
  content?: string
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.bookId || data.bookId.trim() === '') {
    errors.push('ID del libro es requerido')
  }

  if (!data.bookTitle || data.bookTitle.trim() === '') {
    errors.push('Título del libro es requerido')
  }

  if (!data.rating || data.rating < 1 || data.rating > 5) {
    errors.push('La calificación debe estar entre 1 y 5')
  }

  if (!data.content || data.content.trim() === '') {
    errors.push('El contenido de la reseña es requerido')
  }

  if (data.content && data.content.trim().length < 10) {
    errors.push('La reseña debe tener al menos 10 caracteres')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export function sanitizeSearchQuery(query: string): string {
  if (!query) return ''
  
  return query
    .trim()
    .replace(/[<>]/g, '') // Remover caracteres potencialmente peligrosos
    .replace(/\s+/g, ' ') // Normalizar espacios múltiples
    .substring(0, 100) // Limitar longitud
}

export function formatBookTitle(title: string): string {
  if (!title) return 'Título desconocido'
  
  return title
    .trim()
    .replace(/\s+/g, ' ') // Normalizar espacios
    .substring(0, 200) // Limitar longitud
}

export function formatAuthors(authors: string[]): string {
  if (!authors || authors.length === 0) return 'Autor desconocido'
  
  return authors
    .filter(author => author && author.trim() !== '')
    .map(author => author.trim())
    .join(', ')
}

export function calculateAverageRating(ratings: number[]): number {
  if (!ratings || ratings.length === 0) return 0
  
  const sum = ratings.reduce((acc, rating) => acc + rating, 0)
  return Math.round((sum / ratings.length) * 10) / 10 // Redondear a 1 decimal
}

export function generateReviewId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

describe('Funciones de Utilidad', () => {
  describe('validateReviewData', () => {
    it('debería validar datos correctos', () => {
      const validData = {
        bookId: 'test-id',
        bookTitle: 'Test Book',
        rating: 5,
        content: 'Esta es una reseña válida con más de 10 caracteres'
      }

      const result = validateReviewData(validData)

      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual([])
    })

    it('debería detectar bookId faltante', () => {
      const invalidData = {
        bookTitle: 'Test Book',
        rating: 5,
        content: 'Esta es una reseña válida'
      }

      const result = validateReviewData(invalidData)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('ID del libro es requerido')
    })

    it('debería detectar bookTitle faltante', () => {
      const invalidData = {
        bookId: 'test-id',
        rating: 5,
        content: 'Esta es una reseña válida'
      }

      const result = validateReviewData(invalidData)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Título del libro es requerido')
    })

    it('debería detectar rating inválido', () => {
      const invalidData = {
        bookId: 'test-id',
        bookTitle: 'Test Book',
        rating: 0,
        content: 'Esta es una reseña válida'
      }

      const result = validateReviewData(invalidData)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('La calificación debe estar entre 1 y 5')
    })

    it('debería detectar rating mayor a 5', () => {
      const invalidData = {
        bookId: 'test-id',
        bookTitle: 'Test Book',
        rating: 6,
        content: 'Esta es una reseña válida'
      }

      const result = validateReviewData(invalidData)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('La calificación debe estar entre 1 y 5')
    })

    it('debería detectar contenido faltante', () => {
      const invalidData = {
        bookId: 'test-id',
        bookTitle: 'Test Book',
        rating: 5
      }

      const result = validateReviewData(invalidData)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('El contenido de la reseña es requerido')
    })

    it('debería detectar contenido muy corto', () => {
      const invalidData = {
        bookId: 'test-id',
        bookTitle: 'Test Book',
        rating: 5,
        content: 'Corto'
      }

      const result = validateReviewData(invalidData)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('La reseña debe tener al menos 10 caracteres')
    })

    it('debería detectar múltiples errores', () => {
      const invalidData = {
        bookId: '',
        bookTitle: '',
        rating: 0,
        content: 'Corto'
      }

      const result = validateReviewData(invalidData)

      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(4)
      expect(result.errors).toContain('ID del libro es requerido')
      expect(result.errors).toContain('Título del libro es requerido')
      expect(result.errors).toContain('La calificación debe estar entre 1 y 5')
      expect(result.errors).toContain('La reseña debe tener al menos 10 caracteres')
    })
  })

  describe('sanitizeSearchQuery', () => {
    it('debería retornar string vacío para query vacío', () => {
      expect(sanitizeSearchQuery('')).toBe('')
      expect(sanitizeSearchQuery(null as any)).toBe('')
      expect(sanitizeSearchQuery(undefined as any)).toBe('')
    })

    it('debería limpiar espacios extra', () => {
      expect(sanitizeSearchQuery('  test  query  ')).toBe('test query')
    })

    it('debería normalizar espacios múltiples', () => {
      expect(sanitizeSearchQuery('test    query')).toBe('test query')
    })

    it('debería remover caracteres peligrosos', () => {
      expect(sanitizeSearchQuery('test<query>')).toBe('testquery')
    })

    it('debería limitar la longitud', () => {
      const longQuery = 'a'.repeat(150)
      const result = sanitizeSearchQuery(longQuery)
      expect(result.length).toBe(100)
    })

    it('debería preservar caracteres válidos', () => {
      expect(sanitizeSearchQuery('test & query 123')).toBe('test & query 123')
    })
  })

  describe('formatBookTitle', () => {
    it('debería retornar título por defecto para título vacío', () => {
      expect(formatBookTitle('')).toBe('Título desconocido')
      expect(formatBookTitle(null as any)).toBe('Título desconocido')
      expect(formatBookTitle(undefined as any)).toBe('Título desconocido')
    })

    it('debería limpiar espacios extra', () => {
      expect(formatBookTitle('  Test Book  ')).toBe('Test Book')
    })

    it('debería normalizar espacios múltiples', () => {
      expect(formatBookTitle('Test    Book')).toBe('Test Book')
    })

    it('debería limitar la longitud', () => {
      const longTitle = 'a'.repeat(250)
      const result = formatBookTitle(longTitle)
      expect(result.length).toBe(200)
    })

    it('debería preservar títulos válidos', () => {
      expect(formatBookTitle('Test Book: The Sequel')).toBe('Test Book: The Sequel')
    })
  })

  describe('formatAuthors', () => {
    it('debería retornar autor por defecto para array vacío', () => {
      expect(formatAuthors([])).toBe('Autor desconocido')
      expect(formatAuthors(null as any)).toBe('Autor desconocido')
      expect(formatAuthors(undefined as any)).toBe('Autor desconocido')
    })

    it('debería formatear un solo autor', () => {
      expect(formatAuthors(['John Doe'])).toBe('John Doe')
    })

    it('debería formatear múltiples autores', () => {
      expect(formatAuthors(['John Doe', 'Jane Smith'])).toBe('John Doe, Jane Smith')
    })

    it('debería filtrar autores vacíos', () => {
      expect(formatAuthors(['John Doe', '', 'Jane Smith', '   '])).toBe('John Doe, Jane Smith')
    })

    it('debería limpiar espacios de autores', () => {
      expect(formatAuthors(['  John Doe  ', '  Jane Smith  '])).toBe('John Doe, Jane Smith')
    })

    it('debería manejar autores con caracteres especiales', () => {
      expect(formatAuthors(['José García', 'María López'])).toBe('José García, María López')
    })
  })

  describe('calculateAverageRating', () => {
    it('debería retornar 0 para array vacío', () => {
      expect(calculateAverageRating([])).toBe(0)
      expect(calculateAverageRating(null as any)).toBe(0)
      expect(calculateAverageRating(undefined as any)).toBe(0)
    })

    it('debería calcular promedio correctamente', () => {
      expect(calculateAverageRating([5, 4, 3])).toBe(4)
    })

    it('debería redondear a 1 decimal', () => {
      expect(calculateAverageRating([5, 4, 3, 2])).toBe(3.5)
    })

    it('debería manejar ratings con decimales', () => {
      expect(calculateAverageRating([4.5, 3.5, 5])).toBe(4.3)
    })

    it('debería manejar un solo rating', () => {
      expect(calculateAverageRating([5])).toBe(5)
    })
  })

  describe('generateReviewId', () => {
    it('debería generar ID único', () => {
      const id1 = generateReviewId()
      const id2 = generateReviewId()

      expect(id1).not.toBe(id2)
    })

    it('debería tener formato correcto', () => {
      const id = generateReviewId()
      expect(id).toMatch(/^\d+-[a-z0-9]+$/)
    })

    it('debería incluir timestamp', () => {
      const before = Date.now()
      const id = generateReviewId()
      const after = Date.now()

      const timestamp = parseInt(id.split('-')[0])
      expect(timestamp).toBeGreaterThanOrEqual(before)
      expect(timestamp).toBeLessThanOrEqual(after)
    })
  })
})
