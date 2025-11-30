import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import BookDetails from './BookDetails';
import * as api from '../services/api';

vi.mock('../services/api');

const renderWithRouter = (component, initialEntry = '/book/1') => {
    return render(
        <MemoryRouter initialEntries={[initialEntry]}>
            <Routes>
                <Route path="/book/:id" element={component} />
            </Routes>
        </MemoryRouter>
    );
};

describe('BookDetails Page', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('renders loading state initially', () => {
        api.getBookDetails.mockImplementation(() => new Promise(() => { })); // Never resolves
        renderWithRouter(<BookDetails />);
        expect(screen.getByText('Loading details...')).toBeInTheDocument();
    });

    it('renders book details when loaded', async () => {
        const mockBook = {
            id: '1',
            volumeInfo: {
                title: 'Test Book',
                authors: ['Test Author'],
                description: '<p>Test Description</p>',
                publisher: 'Test Publisher',
                publishedDate: '2023',
                pageCount: 100,
                categories: ['Fiction'],
                imageLinks: { large: 'http://example.com/cover.jpg' },
            },
        };

        api.getBookDetails.mockResolvedValue(mockBook);

        renderWithRouter(<BookDetails />);

        await waitFor(() => {
            expect(screen.getByText('Test Book')).toBeInTheDocument();
            expect(screen.getByText('by Test Author')).toBeInTheDocument();
            expect(screen.getByText('Publisher:')).toBeInTheDocument();
            expect(screen.getByText('Test Publisher')).toBeInTheDocument();
            expect(screen.getByText('Fiction')).toBeInTheDocument();
        });
    });

    it('renders error message on API failure', async () => {
        api.getBookDetails.mockRejectedValue(new Error('API Error'));

        renderWithRouter(<BookDetails />);

        await waitFor(() => {
            expect(screen.getByText('Failed to load book details.')).toBeInTheDocument();
        });
    });

    it('renders not found message when book is null', async () => {
        api.getBookDetails.mockResolvedValue(null);

        renderWithRouter(<BookDetails />);

        await waitFor(() => {
            expect(screen.getByText('Book not found.')).toBeInTheDocument();
        });
    });
});
