const express = require('express');
const axios = require('axios');

const app = express();
const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

app.use(express.json());
app.use(express.static('public'));

// In-memory store for reviews
const reviews = {};

// Search books by query (title, author, ISBN, etc.)
app.get('/search', async (req, res) => {
  const q = req.query.q;
  if (!q) {
    return res.status(400).json({ error: 'q query parameter is required' });
  }
  try {
    const response = await axios.get(GOOGLE_BOOKS_API, { params: { q } });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// Retrieve detailed information for a specific book
app.get('/books/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`${GOOGLE_BOOKS_API}/${id}`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch book details' });
  }
});

// List reviews for a book
app.get('/books/:id/reviews', (req, res) => {
  const { id } = req.params;
  res.json(reviews[id] || []);
});

// Add a review for a book
app.post('/books/:id/reviews', (req, res) => {
  const { id } = req.params;
  const { rating, text } = req.body;
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }
  const review = {
    id: Date.now().toString(),
    rating,
    text: text || '',
    votes: 0,
  };
  reviews[id] = reviews[id] || [];
  reviews[id].push(review);
  res.status(201).json(review);
});

// Vote for a review
app.post('/books/:bookId/reviews/:reviewId/vote', (req, res) => {
  const { bookId, reviewId } = req.params;
  const { direction } = req.body;
  const bookReviews = reviews[bookId] || [];
  const review = bookReviews.find(r => r.id === reviewId);
  if (!review) {
    return res.status(404).json({ error: 'Review not found' });
  }
  if (direction === 'up') {
    review.votes += 1;
  } else if (direction === 'down') {
    review.votes -= 1;
  } else {
    return res.status(400).json({ error: 'direction must be "up" or "down"' });
  }
  res.json(review);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
