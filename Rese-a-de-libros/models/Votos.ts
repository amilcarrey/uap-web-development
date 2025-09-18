import mongoose, { Schema, model, models } from "mongoose";

const voteSchema = new Schema({
  review: { type: Schema.Types.ObjectId, ref: "Review", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["up", "down"], required: true }
}, { timestamps: true });

const Vote = models.Vote || model("Vote", voteSchema);
export default Vote;
