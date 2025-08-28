import { buscarLibroPorID } from '@/app/lib/apiGoogleBooks';
import { obtenerResenasPorLibro } from '@/app/lib/apiResenas';
import DetalleLibroCliente from '../../../../components/DetalleLibroCliente';

export default async function PaginaLibro({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const libro = await buscarLibroPorID(id);
  const reseñas = await obtenerResenasPorLibro(id);

  if (!libro) {
    return (
      <main className="p-6 flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg">Libro no encontrado.</p>
      </main>
    );
  }

  return (
    <main className="p-6 bg-black min-h-screen">
      <DetalleLibroCliente libro={libro} reseñasIniciales={reseñas} />
    </main>
  );
}
