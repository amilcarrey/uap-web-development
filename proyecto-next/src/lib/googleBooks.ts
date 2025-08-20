export async function searchBooks(query: string) {
  const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
  if (!res.ok) throw new Error("Error buscando libros");
  return res.json();
}

export async function getBookById(id: string) {
  const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`);
  if (!res.ok) return null;
  return res.json();
}
