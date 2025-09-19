import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  bookId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  votes: { type: Number, default: 0 },
}, { timestamps: true });

export const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);
