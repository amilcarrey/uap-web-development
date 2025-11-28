// archivo que se encarga de la logica de reseñas
// crear, listar, votar, etc.

"use server";

import * as fs from 'fs/promises'; // <-- Cambia esto
import path from 'path';
import { Reseña } from '../app/tipos/libro';
import { revalidatePath } from 'next/cache';

const resenasPath = path.join(process.cwd(), 'data', 'resenas.json');

export async function ensureFileExists(filePath: string) {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true }).catch(() => {});
    await fs.access(filePath).catch(() => 
        fs.writeFile(filePath, "[]"));
}

export async function readResenas(): Promise<Reseña[]> {
  await ensureFileExists(resenasPath);
  const data = await fs.readFile(resenasPath, "utf-8");
  return JSON.parse(data || "[]");
}

export async function writeResenas(reseñas: Reseña[]) {
  await fs.writeFile(resenasPath, JSON.stringify(reseñas, null, 2));
}

export async function getReseñasByLibro(libroId: string): Promise<Reseña[]> {
  const reseñas = await readResenas();
  return reseñas.filter(r => r.idLibro === libroId);
}

export async function agregarReseña(formData: FormData) {
  const reseñas = await readResenas();

  const nuevaReseña: Reseña = {
    id: Date.now().toString(),
    idLibro: formData.get("idLibro") as string,
    usuario: formData.get("usuario") as string,
    comentario: formData.get("comentario") as string,
    valoracion: Number(formData.get("valoracion")),
    likes: 0,
    dislikes: 0,
  };

  reseñas.push(nuevaReseña);
  await writeResenas(reseñas);

  revalidatePath(`/book/${nuevaReseña.idLibro}`);
  return { success: true }; // <--- Esto evita el "Unexpected end of JSON input"

}

export async function votarReseña(formData: FormData) {
  const reseñas = await readResenas();

  const id = formData.get("id") as string;
  const tipo = formData.get("tipo") as "like" | "dislike";

  const reseña = reseñas.find(r => r.id === id);
  if (!reseña) return;

  if (tipo === "like") reseña.likes++;
  else if (tipo === "dislike") reseña.dislikes++;

  await writeResenas(reseñas);
  revalidatePath(`/book/${reseña.idLibro}`);
}