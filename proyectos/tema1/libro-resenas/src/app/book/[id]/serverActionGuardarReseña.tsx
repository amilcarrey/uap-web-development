"use server";

export async function guardarResena(formData: FormData) {
  const review = formData.get("review") as string;
  const rating = formData.get("rating") as string;
  // Aquí guardarías la reseña en una base de datos o archivo
  // Por ahora solo retorna la reseña para mostrarla
  return { review, rating };
}