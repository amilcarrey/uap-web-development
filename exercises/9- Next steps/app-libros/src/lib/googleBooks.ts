const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

export async function searchBooks(query: string) {
    const response = await fetch(`${BASE_URL}?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
        throw new Error('Error buscando libros');
    }
    return response.json();
}

export async function getBookById(id:string) {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) {
        throw new Error('Error obteniendo el libro');
    }
    return response.json();
}