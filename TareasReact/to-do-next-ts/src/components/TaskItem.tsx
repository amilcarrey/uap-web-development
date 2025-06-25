'use client';

import { useState } from 'react';
import { useConfigStore } from '@/stores/configStore';
import { Pencil, Trash2, Save } from 'lucide-react';

type Tarea = {
  id: string;
  texto: string;
  completada: boolean;
  tableroId: string;
};

type Props = {
  tarea: Tarea;
  onToggle?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string, texto: string) => void;
  puedeEditar?: boolean;
};

export default function TaskItem({ tarea, onToggle, onDelete, onEdit, puedeEditar }: Props) {
  const { mayusculas } = useConfigStore();
  const [modoEdicion, setModoEdicion] = useState(false);
  const [textoEditado, setTextoEditado] = useState(tarea.texto);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textoEditado.trim()) {
      onEdit?.(tarea.id, textoEditado);
      setModoEdicion(false);
    }
  };

  return (
    <div className="flex items-center justify-between bg-white border border-gray-300 rounded-xl px-4 py-3 shadow transition-all hover:shadow-md">
      <button
        onClick={() => {
          if (puedeEditar) onToggle?.(tarea.id);
        }}
        className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition ${tarea.completada ? 'bg-green-500 border-green-500' : 'border-gray-400'
          } ${!puedeEditar ? 'cursor-not-allowed opacity-50' : 'hover:border-gray-600'}`}
        title={puedeEditar ? "Marcar como completada" : "Sin permiso para modificar"}
        disabled={!puedeEditar}
      >
        {tarea.completada && <span className="text-white text-sm font-bold">✓</span>}
      </button>


      {modoEdicion ? (
        <form onSubmit={handleSubmit} className="flex-1 mr-3">
          <input
            type="text"
            value={textoEditado}
            onChange={(e) => setTextoEditado(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            autoFocus
          />
        </form>
      ) : (
        <span
          className={`flex-1 text-base text-gray-800 ${tarea.completada ? 'line-through text-gray-400' : ''
            }`}
        >
          {mayusculas ? tarea.texto.toUpperCase() : tarea.texto}
        </span>
      )}

      {puedeEditar && (
        <div className="flex gap-2 ml-3 text-gray-600">
          {modoEdicion ? (
            <button
              onClick={handleSubmit}
              title="Guardar"
              className="hover:text-green-600 transition"
            >
              <Save size={18} />
            </button>
          ) : (
            <button
              onClick={() => setModoEdicion(true)}
              title="Editar"
              className="hover:text-yellow-500 transition"
            >
              <Pencil size={18} />
            </button>
          )}
          <button
            onClick={() => onDelete?.(tarea.id)}
            title="Eliminar"
            className="hover:text-red-500 transition"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
