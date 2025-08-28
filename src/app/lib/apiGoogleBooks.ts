const API_URL = 'https://www.googleapis.com/books/v1/volumes';

export async function buscarLibros(query: string, startIndex = 0, maxResults = 10) {
  try {
    const res = await fetch(`${API_URL}?q=${encodeURIComponent(query)}&startIndex=${startIndex}&maxResults=${maxResults}`);

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return data.items || [];
  } catch (error) {
    return [];
  }
}

export async function buscarLibroPorID(id: string) {
  try {
    const res = await fetch(`${API_URL}/${id}`);

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch (error) {
    return null;
  }
}
