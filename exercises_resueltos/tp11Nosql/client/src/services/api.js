const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

export const searchBooks = async (query) => {
    if (!query) return [];

    try {
        const response = await fetch(`${BASE_URL}?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.error('Error searching books:', error);
        return [];
    }
};

export const getBookDetails = async (id) => {
    if (!id) return null;

    try {
        const response = await fetch(`${BASE_URL}/${id}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching book details:', error);
        return null;
    }
};
