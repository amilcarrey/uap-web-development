import express from 'express';
import Vote from '../models/Vote.js';
import Review from '../models/Review.js';
import { protect } from '../middleware/auth.js';
import { z } from 'zod';

const router = express.Router();

const voteSchema = z.object({
    reviewId: z.string(),
    value: z.enum([1, -1]), // 1 or -1
});

// @desc    Vote on a review
// @route   POST /api/votes
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        // Manually parse value to number if it comes as string, though z.enum expects values.
        // Actually z.enum with numbers works if input is number.
        // Let's relax schema slightly to allow coercing if needed or just expect correct types.
        // Zod enum with numbers is tricky if JSON sends numbers.
        // Better: z.number().refine(val => val === 1 || val === -1)

        // Let's use simple validation
        const { reviewId, value } = req.body;

        if (![1, -1].includes(value)) {
            return res.status(400).json({ message: 'Value must be 1 or -1' });
        }

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        const existingVote = await Vote.findOne({
            user: req.user._id,
            review: reviewId,
        });

        if (existingVote) {
            if (existingVote.value === value) {
                // Toggle off (remove vote)
                await existingVote.deleteOne();
                review.votes -= value;
            } else {
                // Change vote
                review.votes -= existingVote.value; // Remove old
                review.votes += value; // Add new
                existingVote.value = value;
                await existingVote.save();
            }
        } else {
            // New vote
            await Vote.create({
                user: req.user._id,
                review: reviewId,
                value,
            });
            review.votes += value;
        }

        await review.save();
        res.json({ votes: review.votes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
