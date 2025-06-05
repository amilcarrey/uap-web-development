import React, { useState } from 'react';
import { useToggleTarea, useEliminarTarea, useEditarTarea } from '../hooks/useTareas';
import { useAppStore } from '../store/appStore';
import { type Tarea } from '../types/types';

interface Props {
  tarea: Tarea;
}

const TareaItem: React.FC<Props> = ({ tarea }) => {
  const toggleTarea = useToggleTarea();
  const eliminarTarea = useEliminarTarea();
  const editarTarea = useEditarTarea();
  const { setEditingTarea, showToast, editingTarea } = useAppStore();
  const [editContent, setEditContent] = useState(tarea.content);

  const handleEditSubmit = () => {
    if (!editContent.trim()) {
      showToast('El contenido no puede estar vacío', 'error');
      return;
    }
    editarTarea.mutate(
      { id: tarea.id, content: editContent },
      {
        onSuccess: () => {
          showToast('Tarea actualizada', 'success');
          setEditingTarea(null); // Limpiar el estado de edición
        },
        onError: () => showToast('Error al editar tarea', 'error'),
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleEditSubmit();
    }
  };

  return (
    <li className="task-item">
      {editingTarea?.id === tarea.id ? (
        <div>
          <input
            type="text"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Editar tarea..."
            autoFocus
          />
          <button onClick={handleEditSubmit}>Guardar</button>
          <button onClick={() => setEditingTarea(null)}>Cancelar</button>
        </div>
      ) : (
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
          <button
            onClick={() => {
              setEditingTarea({ id: tarea.id, content: tarea.content });
              setEditContent(tarea.content); // Sincronizar el input con el contenido
            }}
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
        </div>
      )}
    </li>
  );
};

export default TareaItem;