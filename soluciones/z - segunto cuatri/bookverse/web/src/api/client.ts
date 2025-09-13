// Cliente HTTP simple. Usa el backend como proxy.
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'


export async function api<T>(path: string, init?: RequestInit): Promise<T> {
const res = await fetch(`${BASE}${path}`, init)
if (!res.ok) throw new Error(await res.text())
return res.json()
}


export const BooksAPI = {
search: (q: string) => api(`/api/books/search?q=${encodeURIComponent(q)}`),
detail: (id: string) => api(`/api/books/${id}`)
}


export const ReviewsAPI = {
list: (bookId: string) => api(`/api/reviews?bookId=${encodeURIComponent(bookId)}`),
create: (userId: string, body: any) => api(`/api/reviews`, {
method: 'POST', headers: { 'Content-Type':'application/json', 'X-User-Id': userId }, body: JSON.stringify(body)
}),
vote: (userId: string, reviewId: string, value: 1 | -1) => api(`/api/reviews/${reviewId}/vote`, {
method: 'POST', headers: { 'Content-Type':'application/json', 'X-User-Id': userId }, body: JSON.stringify({ value })
})
}