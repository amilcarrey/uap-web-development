import React from 'react';
import { useToggleTarea, useEliminarTarea } from '../hooks/useTareas';
import { useAppStore } from '../store/appStore';
import { type Tarea } from '../types/types';

interface Props {
  tarea: Tarea;
}

const TareaItem: React.FC<Props> = ({ tarea }) => {
  const toggleTarea = useToggleTarea();
  const eliminarTarea = useEliminarTarea();
  const { setEditingTarea, showToast } = useAppStore();

  return (
    <li className="task-item">
      <div>
        <input
          type="checkbox"
          checked={tarea.completed}
          onChange={() =>
            toggleTarea.mutate(
              { id: tarea.id, completed: tarea.completed },
              {
                onSuccess: () => showToast('Tarea actualizada', 'success'),
                onError: () => showToast('Error al actualizar tarea', 'error'),
              }
            )
          }
        />
        <span className={`task-text ${tarea.completed ? 'completed' : ''}`}>
          {tarea.content}
        </span>
      </div>
      <button
        onClick={() => setEditingTarea({ id: tarea.id, content: tarea.content })}
      >
        Editar
      </button>
      <button
        onClick={() =>
          eliminarTarea.mutate(tarea.id, {
            onSuccess: () => showToast('Tarea eliminada', 'success'),
            onError: () => showToast('Error al eliminar tarea', 'error'),
          })
        }
      >
        Eliminar
      </button>
    </li>
  );
};

export default TareaItem;