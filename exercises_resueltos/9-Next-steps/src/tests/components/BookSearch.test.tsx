import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@/utils/test-utils'
import BookSearch from '@/components/BookSearch'
import '@testing-library/jest-dom'

describe('BookSearch', () => {
  const mockOnSearch = vi.fn()
  const defaultProps = {
    onSearch: mockOnSearch,
    loading: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders search form correctly', () => {
    render(<BookSearch {...defaultProps} />)
    
    expect(screen.getByPlaceholderText('Título del libro...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Buscar' })).toBeInTheDocument()
    expect(screen.getByLabelText('Buscar por')).toBeInTheDocument()
  })

  it('calls onSearch with correct parameters for title search', async () => {
    render(<BookSearch {...defaultProps} />)
    
    const searchInput = screen.getByPlaceholderText('Título del libro...')
    const searchButton = screen.getByRole('button', { name: 'Buscar' })
    
    fireEvent.change(searchInput, { target: { value: 'Harry Potter' } })
    fireEvent.click(searchButton)
    
    expect(mockOnSearch).toHaveBeenCalledWith('Harry Potter', 'title')
  })

  it('calls onSearch with correct parameters for author search', async () => {
    render(<BookSearch {...defaultProps} />)
    
    const searchTypeSelect = screen.getByLabelText('Buscar por')
    const searchInput = screen.getByPlaceholderText('Nombre del autor...')
    const searchButton = screen.getByRole('button', { name: 'Buscar' })
    
    fireEvent.change(searchTypeSelect, { target: { value: 'author' } })
    fireEvent.change(searchInput, { target: { value: 'Rowling' } })
    fireEvent.click(searchButton)
    
    expect(mockOnSearch).toHaveBeenCalledWith('Rowling', 'author')
  })

  it('calls onSearch with correct parameters for ISBN search', async () => {
    render(<BookSearch {...defaultProps} />)
    
    const searchTypeSelect = screen.getByLabelText('Buscar por')
    const searchInput = screen.getByPlaceholderText('ISBN...')
    const searchButton = screen.getByRole('button', { name: 'Buscar' })
    
    fireEvent.change(searchTypeSelect, { target: { value: 'isbn' } })
    fireEvent.change(searchInput, { target: { value: '9780439708180' } })
    fireEvent.click(searchButton)
    
    expect(mockOnSearch).toHaveBeenCalledWith('9780439708180', 'isbn')
  })

  it('disables button when loading', () => {
    render(<BookSearch {...defaultProps} loading={true} />)
    
    expect(screen.getByRole('button', { name: 'Buscando...' })).toBeDisabled()
  })

  it('disables button when query is empty', () => {
    render(<BookSearch {...defaultProps} />)
    
    expect(screen.getByRole('button', { name: 'Buscar' })).toBeDisabled()
  })

  it('enables button when query is not empty', () => {
    render(<BookSearch {...defaultProps} />)
    
    const searchInput = screen.getByPlaceholderText('Título del libro...')
    fireEvent.change(searchInput, { target: { value: 'Harry' } })
    
    expect(screen.getByRole('button', { name: 'Buscar' })).not.toBeDisabled()
  })

  it('shows validation message for empty search', () => {
    render(<BookSearch {...defaultProps} />)
    
    const searchButton = screen.getByRole('button', { name: 'Buscar' })
    fireEvent.click(searchButton)
    
    expect(mockOnSearch).not.toHaveBeenCalled()
  })
})