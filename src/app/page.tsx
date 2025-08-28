
import { buscarLibros } from './lib/apiGoogleBooks';
import LibrosInteractivos from './LibrosInteractivos';

export default async function HomePage() {
  const librosIniciales = await buscarLibros('tendencias', 0, 20);

  return (
    <div className="min-h-screen bg-gray-">
      <LibrosInteractivos librosIniciales={librosIniciales} />
    </div>
  );
}
