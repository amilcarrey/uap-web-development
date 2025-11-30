import express from 'express';
import Review from '../models/Review.js';
import { protect } from '../middleware/auth.js';
import { z } from 'zod';

const router = express.Router();

const reviewSchema = z.object({
    bookId: z.string(),
    rating: z.number().min(1).max(5),
    content: z.string().min(1),
});

// @desc    Get reviews for a book
// @route   GET /api/reviews/:bookId
// @access  Public
router.get('/:bookId', async (req, res) => {
    try {
        const reviews = await Review.find({ bookId: req.params.bookId }).sort({
            createdAt: -1,
        });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { bookId, rating, content } = reviewSchema.parse(req.body);

        const review = await Review.create({
            bookId,
            user: req.user._id,
            userName: req.user.name,
            rating,
            content,
        });

        res.status(201).json(review);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors });
        }
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await review.deleteOne();
        res.json({ message: 'Review removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const { rating, content } = req.body;

        review.rating = rating || review.rating;
        review.content = content || review.content;

        const updatedReview = await review.save();
        res.json(updatedReview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get user reviews
// @route   GET /api/reviews/user/me
// @access  Private
router.get('/user/me', protect, async (req, res) => {
    try {
        const reviews = await Review.find({ user: req.user._id }).sort({
            createdAt: -1,
        });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
