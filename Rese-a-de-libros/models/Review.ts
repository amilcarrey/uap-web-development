import mongoose, { Schema, model, models } from "mongoose";

const reviewSchema = new Schema({
  bookId: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
  votes: [{ type: Schema.Types.ObjectId, ref: "Vote" }],
}, { timestamps: true });

const Review = models.Review || model("Review", reviewSchema);
export default Review;
