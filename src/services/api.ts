import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:4000',
  headers: { 'Content-Type': 'application/json' },
})

export const fetchReviews = () => api.get('/reviews')
export const postReview = (review: any) => api.post('/reviews', review)
export const updateReview = (id: number, data: any) =>
  api.patch(`/reviews/${id}`, data)