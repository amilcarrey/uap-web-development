
"use server";
//Server action para votar en una reseña
export async function serverActionVotarReseña(libroId: string, reseñaId: string, tipo: 'like' | 'dislike'): Promise<Reseña[]> {
  const reseñasPorLibro = await leerReseñas();
  const lista = reseñasPorLibro[libroId] || [];
  const reseña = lista.find(r => r.id === reseñaId);
  if (reseña) {
    if (tipo === 'like') reseña.likes++;
    if (tipo === 'dislike') reseña.dislikes++;
    await guardarReseñas(reseñasPorLibro);
  }
  return lista;
}

//Server action para obtener reseñas de un libro
export async function serverActionObtenerReseñas(libroId: string): Promise<Reseña[]> {
  const reseñasPorLibro = await leerReseñas();
  return reseñasPorLibro[libroId] || [];
}

import { promises as fs } from "fs";
import path from "path";

export interface Reseña {
  id: string;
  usuario: string;
  texto: string;
  fecha: string;
  rating: number;
  likes: number;
  dislikes: number;
}

const DATA_PATH = path.join(process.cwd(), "data", "reseñas.json");

async function leerReseñas(): Promise<Record<string, Reseña[]>> {
  try {
    const data = await fs.readFile(DATA_PATH, "utf-8");
    return JSON.parse(data);
  } catch (e: any) {
    //Si el archivo no existe, devolvemos objeto vacío
    if (e.code === "ENOENT") return {};
    throw e;
  }
}

async function guardarReseñas(reseñas: Record<string, Reseña[]>) {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(reseñas, null, 2), "utf-8");
}

export async function serverActionGuardarReseña(
  libroId: string,
  usuario: string,
  texto: string,
  rating: number
) {
  const nuevaReseña: Reseña = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    usuario,
    texto,
    fecha: new Date().toISOString(),
    rating,
    likes: 0,
    dislikes: 0,
  };
  const reseñasPorLibro = await leerReseñas();
  if (!reseñasPorLibro[libroId]) {
    reseñasPorLibro[libroId] = [];
  }
  reseñasPorLibro[libroId].push(nuevaReseña);
  await guardarReseñas(reseñasPorLibro);
  return reseñasPorLibro[libroId];
}


export async function guardarResena(formData: FormData) {
  const review = formData.get("review") as string;
  const rating = formData.get("rating") as string;
  // Aquí guardarías la reseña en una base de datos o archivo
  // Por ahora solo retorna la reseña para mostrarla
  return { review, rating };
}