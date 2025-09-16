export interface Reseña {
  id: string;
  usuario: string;
  texto: string;
  fecha: string | Date; // ✅ acepta ambos
  rating: number;
  likes: number;
  dislikes: number;
}
