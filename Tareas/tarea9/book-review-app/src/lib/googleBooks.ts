const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";

export async function searchBooks(query: string) {
  const res = await fetch(`${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}`);
  return res.json();
}

export async function getBookById(id: string) {
  const res = await fetch(`${GOOGLE_BOOKS_API}/${id}`);
  return res.json();
}
