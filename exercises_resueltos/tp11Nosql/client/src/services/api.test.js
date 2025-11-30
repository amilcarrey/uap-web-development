import { describe, it, expect, vi, beforeEach } from 'vitest';
import { searchBooks, getBookDetails } from './api';

describe('API Service', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    describe('searchBooks', () => {
        it('should return a list of books when the search is successful', async () => {
            const mockData = {
                items: [
                    { id: '1', volumeInfo: { title: 'Test Book' } },
                    { id: '2', volumeInfo: { title: 'Another Book' } },
                ],
            };

            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: async () => mockData,
            });

            const result = await searchBooks('test');
            expect(result).toEqual(mockData.items);
            expect(fetch).toHaveBeenCalledWith('https://www.googleapis.com/books/v1/volumes?q=test');
        });

        it('should return an empty array if no query is provided', async () => {
            const result = await searchBooks('');
            expect(result).toEqual([]);
            expect(fetch).not.toHaveBeenCalled();
        });

        it('should return an empty array on API failure', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                ok: false,
            });

            const result = await searchBooks('fail');
            expect(result).toEqual([]);
        });

        it('should return an empty array on network error', async () => {
            global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

            const result = await searchBooks('error');
            expect(result).toEqual([]);
        });
    });

    describe('getBookDetails', () => {
        it('should return book details when successful', async () => {
            const mockBook = { id: '1', volumeInfo: { title: 'Test Book' } };

            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: async () => mockBook,
            });

            const result = await getBookDetails('1');
            expect(result).toEqual(mockBook);
            expect(fetch).toHaveBeenCalledWith('https://www.googleapis.com/books/v1/volumes/1');
        });

        it('should return null if no id is provided', async () => {
            const result = await getBookDetails('');
            expect(result).toBeNull();
            expect(fetch).not.toHaveBeenCalled();
        });

        it('should return null on API failure', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                ok: false,
            });

            const result = await getBookDetails('invalid');
            expect(result).toBeNull();
        });
    });
});
