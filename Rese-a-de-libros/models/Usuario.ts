import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: [{ type: String }], // IDs de libros guardados por el usuario
}, { timestamps: true });

const User = models.User || model("User", userSchema);
export default User;