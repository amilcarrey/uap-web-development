import { useState, useEffect } from 'react';
import { useAddTask } from '../hooks/useAddTask';
import { useUpdateTask } from '../hooks/useUpdateTask';
import { useUIStore } from '../store/uiStore';
import axios from 'axios';

interface TaskFormProps {
  boardId: string;
  page: number;
}

const TaskForm = ({ boardId, page }: TaskFormProps) => {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const { mutate: addTask } = useAddTask(boardId, page);
  const { mutate: updateTask } = useUpdateTask(boardId, page);

  const editingTask = useUIStore((s) => s.editingTask);
  const setEditingTask = useUIStore((s) => s.setEditingTask);

  useEffect(() => {
    if (editingTask) {
      setText(editingTask.text);
    }
  }, [editingTask]);

  const handleAddOrEdit = async () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setError('El texto es obligatorio');
      return;
    }

    try {
      if (editingTask) {
        await updateTask(
          { id: editingTask.id, text: trimmed },
          {
            onError: (err: any) => {
              const res = err?.response?.data;
              const detail = res?.details?.find((d: any) => d.path === 'text');
              setError(detail?.message || res?.error || 'Error al editar');
            },
            onSuccess: () => {
              setText('');
              setEditingTask(null);
              setError('');
            }
          }
        );
      } else {
        await addTask(trimmed, {
          onError: (err: any) => {
            const res = err?.response?.data;
            const detail = res?.details?.find((d: any) => d.path === 'text');
            setError(detail?.message || res?.error || 'Error al agregar');
          },
          onSuccess: () => {
            setText('');
            setError('');
          }
        });
      }
    } catch (err) {
      setError('Error inesperado');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAddOrEdit();
  };

  const handleCancel = () => {
    setEditingTask(null);
    setText('');
    setError('');
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2">
        <input
          className="border p-2 flex-1"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={editingTask ? 'Editar tarea...' : 'Agregar tarea...'}
        />
        <button
          className="bg-blue-500 text-white px-4"
          onClick={handleAddOrEdit}
        >
          {editingTask ? 'Guardar' : 'Agregar'}
        </button>
        {editingTask && (
          <button
            className="bg-gray-400 text-white px-4"
            onClick={handleCancel}
          >
            Cancelar
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-sm pl-1">{error}</p>}
    </div>
  );
};

export default TaskForm;
