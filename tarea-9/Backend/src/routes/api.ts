import { Router } from "express";
import { searchBooks, getBook, getBookReviews, createReview, voteReview } from "../controllers/booksController.js";

const router = Router();

// Books proxy/search
router.get("/books", searchBooks);
router.get("/books/:id", getBook);

// Reviews
router.get("/books/:id/reviews", getBookReviews);
router.post("/reviews", createReview);
router.post("/reviews/:id/vote", voteReview);

export default router;
