import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '../components/SearchBar';
import axios from 'axios';

vi.mock('axios');

describe('SearchBar', () => {
  const onSearch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders search input and button', () => {
    render(<SearchBar onSearch={onSearch} />);
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('search-button')).toBeInTheDocument();
  });

  it('does not search if query is empty', async () => {
    render(<SearchBar onSearch={onSearch} />);
    await userEvent.click(screen.getByTestId('search-button'));
    expect(axios.get).not.toHaveBeenCalled();
    expect(onSearch).not.toHaveBeenCalled();
  });

  it('searches by title/author', async () => {
    const mockResponse = { data: { items: [{ id: '1', volumeInfo: { title: 'Book' } }] } };
    vi.mocked(axios.get).mockResolvedValue(mockResponse);
    render(<SearchBar onSearch={onSearch} />);
    await userEvent.type(screen.getByTestId('search-input'), 'Harry Potter');
    await userEvent.click(screen.getByTestId('search-button'));
    expect(axios.get).toHaveBeenCalledWith(
      'https://www.googleapis.com/books/v1/volumes?q=Harry%20Potter'
    );
    expect(onSearch).toHaveBeenCalledWith(mockResponse.data.items);
  });

  it('searches by ISBN', async () => {
    const mockResponse = { data: { items: [{ id: '1', volumeInfo: { title: 'Book' } }] } };
    vi.mocked(axios.get).mockResolvedValue(mockResponse);
    render(<SearchBar onSearch={onSearch} />);
    await userEvent.type(screen.getByTestId('search-input'), '9780439708180');
    await userEvent.click(screen.getByTestId('search-button'));
    expect(axios.get).toHaveBeenCalledWith(
      'https://www.googleapis.com/books/v1/volumes?q=isbn%3A9780439708180'
    );
    expect(onSearch).toHaveBeenCalledWith(mockResponse.data.items);
  });

  it('shows error when API returns no results', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: { items: [] } });
    render(<SearchBar onSearch={onSearch} />);
    await userEvent.type(screen.getByTestId('search-input'), 'Invalid');
    await userEvent.click(screen.getByTestId('search-button'));
    expect(screen.getByTestId('error-message')).toHaveTextContent(
      'No se encontraron resultados para esta búsqueda.'
    );
  });

  it('shows error on API failure', async () => {
    vi.mocked(axios.get).mockRejectedValue(new Error('API error'));
    render(<SearchBar onSearch={onSearch} />);
    await userEvent.type(screen.getByTestId('search-input'), 'Error');
    await userEvent.click(screen.getByTestId('search-button'));
    expect(screen.getByTestId('error-message')).toHaveTextContent(
      'Hubo un error al buscar. Intenta de nuevo.'
    );
  });
});