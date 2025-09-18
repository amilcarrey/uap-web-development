import { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, unique: true, required: true, index: true, lowercase: true, trim: true }, // 👈
    passwordHash: { type: String, required: true },
    name: { type: String, trim: true },
  },
  { timestamps: true }
);

export const User = models.User || model("User", UserSchema);
