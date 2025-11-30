import express from 'express';
import Favorite from '../models/Favorite.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get user favorites
// @route   GET /api/favorites
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const favorites = await Favorite.find({ user: req.user._id }).sort({
            createdAt: -1,
        });
        res.json(favorites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Add to favorites
// @route   POST /api/favorites
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { bookId, title, cover, authors } = req.body;

        const existingFavorite = await Favorite.findOne({
            user: req.user._id,
            bookId,
        });

        if (existingFavorite) {
            return res.status(400).json({ message: 'Book already in favorites' });
        }

        const favorite = await Favorite.create({
            user: req.user._id,
            bookId,
            title,
            cover,
            authors,
        });

        res.status(201).json(favorite);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Remove from favorites
// @route   DELETE /api/favorites/:bookId
// @access  Private
router.delete('/:bookId', protect, async (req, res) => {
    try {
        const favorite = await Favorite.findOne({
            user: req.user._id,
            bookId: req.params.bookId,
        });

        if (!favorite) {
            return res.status(404).json({ message: 'Favorite not found' });
        }

        await favorite.deleteOne();
        res.json({ message: 'Removed from favorites' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Check if book is favorite
// @route   GET /api/favorites/check/:bookId
// @access  Private
router.get('/check/:bookId', protect, async (req, res) => {
    try {
        const favorite = await Favorite.findOne({
            user: req.user._id,
            bookId: req.params.bookId,
        });
        res.json({ isFavorite: !!favorite });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
