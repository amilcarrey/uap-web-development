import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';
import * as api from '../services/api';

// Mock the API module
vi.mock('../services/api');

const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Home Page', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('renders the search bar and hero section', () => {
        renderWithRouter(<Home />);
        expect(screen.getByText('Discover Your Next Favorite Book')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Search for books...')).toBeInTheDocument();
    });

    it('performs a search and displays results', async () => {
        const mockBooks = [
            {
                id: '1',
                volumeInfo: {
                    title: 'Test Book 1',
                    authors: ['Author 1'],
                    imageLinks: { thumbnail: 'http://example.com/img1.jpg' },
                },
            },
            {
                id: '2',
                volumeInfo: {
                    title: 'Test Book 2',
                    authors: ['Author 2'],
                },
            },
        ];

        api.searchBooks.mockResolvedValue(mockBooks);

        renderWithRouter(<Home />);

        const input = screen.getByPlaceholderText('Search for books...');
        const button = screen.getByText('Search');

        fireEvent.change(input, { target: { value: 'test' } });
        fireEvent.click(button);

        expect(screen.getByText('Loading...')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
            expect(screen.getByText('Test Book 1')).toBeInTheDocument();
            expect(screen.getByText('Test Book 2')).toBeInTheDocument();
        });

        expect(api.searchBooks).toHaveBeenCalledWith('test');
    });

    it('displays no results message when search returns empty', async () => {
        api.searchBooks.mockResolvedValue([]);

        renderWithRouter(<Home />);

        const input = screen.getByPlaceholderText('Search for books...');
        const button = screen.getByText('Search');

        fireEvent.change(input, { target: { value: 'empty' } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText('No books found. Try a different search.')).toBeInTheDocument();
        });
    });

    it('handles API errors gracefully', async () => {
        api.searchBooks.mockRejectedValue(new Error('API Error'));

        renderWithRouter(<Home />);

        const input = screen.getByPlaceholderText('Search for books...');
        const button = screen.getByText('Search');

        fireEvent.change(input, { target: { value: 'error' } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText('Failed to fetch books. Please try again.')).toBeInTheDocument();
        });
    });
});
