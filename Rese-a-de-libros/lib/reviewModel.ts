import mongoose, { Schema, model, models } from "mongoose";

const ReviewSchema = new Schema({
  libroId: { type: String, required: true },
  usuarioEmail: { type: String, required: true },
  comentario: { type: String, required: true },
  calificacion: { type: Number, required: true },
  votos: { type: Number, default: 0 },
});

const Review = models.Review || model("Review", ReviewSchema);
export default Review;
