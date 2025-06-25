'use client';

import { ListChecks, CircleCheck, CircleDashed } from 'lucide-react';

type Props = {
  filtroActual: string;
  onChange: (nuevo: string) => void;
};

const opciones = [
  { key: 'todas', label: 'Todas', icon: <ListChecks size={18} /> },
  { key: 'incompletas', label: 'Incompletas', icon: <CircleDashed size={18} /> },
  { key: 'completas', label: 'Completas', icon: <CircleCheck size={18} /> },
];

export default function FiltroButtons({ filtroActual, onChange }: Props) {
  return (
    <div className="flex justify-center gap-4 my-6">
      {opciones.map((opcion) => (
        <button
          key={opcion.key}
          onClick={() => onChange(opcion.key)}
          className={`flex items-center gap-2 px-5 py-2 rounded-full font-medium shadow-sm border transition
            ${
              filtroActual === opcion.key
                ? 'bg-cyan-700 text-white border-cyan-700'
                : 'bg-cyan-50 text-cyan-800 border-cyan-200 hover:bg-cyan-100'
            }
          `}
        >
          {opcion.icon}
          {opcion.label}
        </button>
      ))}
    </div>
  );
}
