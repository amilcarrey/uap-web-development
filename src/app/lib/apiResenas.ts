
import { prisma } from '@/app/lib/prisma';

export async function obtenerResenasPorLibro(libroId: string) {
  const reseñas = await prisma.reseña.findMany({
    where: { libroId },
    include: { votos: true },
  });

  const data = reseñas.map((r) => {
    const likes = r.votos.filter((v) => v.tipo === 'UP').length;
    const dislikes = r.votos.filter((v) => v.tipo === 'DOWN').length;

    return {
      id: r.id,
      contenido: r.contenido,
      calificacion: r.calificacion,
      likes,
      dislikes,
    };
  });

  // Ordenar por likes descendente
  data.sort((a, b) => b.likes - a.likes);

  return data;
}
