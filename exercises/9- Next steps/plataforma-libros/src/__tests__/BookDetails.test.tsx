import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BookDetails from '../components/BookDetails';

describe('BookDetails', () => {
  const book = {
    volumeInfo: {
      title: 'Harry Potter',
      authors: ['J.K. Rowling'],
      publishedDate: '1997',
      pageCount: 300,
      description: '<p>Great book!</p>',
      imageLinks: { thumbnail: 'http://example.com/image.jpg' },
    },
  };

  it('renders book details', () => {
    render(<BookDetails book={book} />);
    expect(screen.getByText('Harry Potter')).toBeInTheDocument();
    expect(screen.getByText('Autor: J.K. Rowling')).toBeInTheDocument();
    expect(screen.getByText('Publicado: 1997')).toBeInTheDocument();
    expect(screen.getByText('Páginas: 300')).toBeInTheDocument();
    expect(screen.getByText('Great book!')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'http://example.com/image.jpg');
  });

  it('handles missing description', () => {
    const bookNoDesc = { volumeInfo: { ...book.volumeInfo, description: undefined } };
    render(<BookDetails book={bookNoDesc} />);
    expect(screen.getByText(/No hay descripción disponible/i)).toBeInTheDocument();
  });

  it('handles missing authors', () => {
    const bookNoAuthors = { volumeInfo: { ...book.volumeInfo, authors: undefined } };
    render(<BookDetails book={bookNoAuthors} />);
    expect(screen.getByText('Autor: Desconocido')).toBeInTheDocument();
  });

  it('handles missing image', () => {
    const bookNoImage = { volumeInfo: { ...book.volumeInfo, imageLinks: undefined } };
    render(<BookDetails book={bookNoImage} />);
    expect(screen.getByRole('img')).toHaveAttribute('src', '/placeholder.jpg');
  });
});