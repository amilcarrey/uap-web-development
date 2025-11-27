import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MainMenu from '../../app/components/MainMenu'

describe('MainMenu', () => {
  it('debería renderizar el título de bienvenida', () => {
    render(<MainMenu />)

    expect(screen.getByText('¡Bienvenido a Books & Reviews!')).toBeInTheDocument()
  })

  it('debería renderizar la descripción de la aplicación', () => {
    render(<MainMenu />)

    expect(screen.getByText(/Descubre nuevos libros, comparte tus opiniones/)).toBeInTheDocument()
  })

  it('debería mostrar la sección "¿Qué puedes hacer?"', () => {
    render(<MainMenu />)

    expect(screen.getByText('¿Qué puedes hacer?')).toBeInTheDocument()
  })

  it('debería mostrar las tres características principales', () => {
    render(<MainMenu />)

    expect(screen.getByText('Explorar Biblioteca')).toBeInTheDocument()
    expect(screen.getByText('Compartir Opiniones')).toBeInTheDocument()
    expect(screen.getByText('Seguir Lecturas')).toBeInTheDocument()
  })

  it('debería mostrar las descripciones de cada característica', () => {
    render(<MainMenu />)

    expect(screen.getByText(/Accede a miles de libros/)).toBeInTheDocument()
    expect(screen.getByText(/Califica y reseña tus libros/)).toBeInTheDocument()
    expect(screen.getByText(/Mantén un registro de tus reseñas/)).toBeInTheDocument()
  })

  it('debería tener la estructura correcta con iconos', () => {
    render(<MainMenu />)

    // Verificar que hay iconos SVG (los iconos se renderizan como elementos SVG)
    const icons = document.querySelectorAll('svg')
    expect(icons.length).toBeGreaterThan(0)
  })

  it('debería tener las clases CSS correctas para el diseño', () => {
    render(<MainMenu />)

    const container = screen.getByText('¡Bienvenido a Books & Reviews!').closest('div')
    expect(container).toHaveClass('space-y-6')
  })

  it('debería tener el grid de características responsive', () => {
    render(<MainMenu />)

    const featuresContainer = screen.getByText('¿Qué puedes hacer?').nextElementSibling
    expect(featuresContainer).toHaveClass('grid', 'md:grid-cols-3')
  })
})
