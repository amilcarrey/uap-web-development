import fs from "fs";
import path from "path";
import { Review, Vote } from "@/types";

const filePath = path.join(process.cwd(), "data", "reviews.json");

function readReviews(): Review[] {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data || "[]");
}

function writeReviews(reviews: Review[]) {
  fs.writeFileSync(filePath, JSON.stringify(reviews, null, 2), "utf-8");
}

export function getReviewsByBook(bookId: string): Review[] {
  return readReviews().filter((r) => r.bookId === bookId);
}

export function addReview(review: Review) {
  const reviews = readReviews();
  reviews.push(review);
  writeReviews(reviews);
}

export function addVote(reviewId: string, userId: string, value: number) {
  if (!reviewId || !userId) {
    throw new Error("Faltan datos para votar");
  }

  const reviews = readReviews();
  const review = reviews.find((r) => r.id === reviewId);
  if (!review) throw new Error("Review no encontrada");

  review.votes = review.votes.filter((v) => v.userId !== userId);

  review.votes.push({ userId, value });
  writeReviews(reviews);
}

export { readReviews };
