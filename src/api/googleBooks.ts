import axios from 'axios'
const BASE = 'https://www.googleapis.com/books/v1/volumes'

export async function searchBooks(query: string) {
  const { data } = await axios.get(`${BASE}?q=${encodeURIComponent(query)}`)
  return data.items
}

export async function getBookById(id: string) {
  const { data } = await axios.get(`${BASE}/${id}`)
  return data
}