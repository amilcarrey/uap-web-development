'use client';

type Props = {
  filtroActual: string;
  onChange: (nuevo: string) => void;
};

const opciones = ['todas', 'incompletas', 'completas'];
// Consigna 6: Agregar botones de filtro que permitan ver todas las tareas, las incompletas y las completas. Prestar atención que si se aplica un filtro, no se pierdan datos y se pueda volver a un estado anterior.

export default function FiltroButtons({ filtroActual, onChange }: Props) {
  return (
    <div className="flex justify-center gap-4 my-6">
      {opciones.map((opcion) => (
        <button
          key={opcion}
          onClick={() => onChange(opcion)}
          className={`px-4 py-2 rounded transition ${
            filtroActual === opcion
              ? 'bg-blue-600 text-white'
              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
          }`}
        >
          {opcion.charAt(0).toUpperCase() + opcion.slice(1)}
        </button>
      ))}
    </div>
  );
}
