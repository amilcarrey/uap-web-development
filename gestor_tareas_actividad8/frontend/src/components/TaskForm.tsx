import { useState, useEffect } from 'react';
import { useAddTask } from '../hooks/useAddTask';
import { useUpdateTask } from '../hooks/useUpdateTask';
import { useUIStore } from '../store/uiStore';

interface TaskFormProps {
  boardId: string;
  page: number;
}

const TaskForm = ({ boardId, page }: TaskFormProps) => {
  const [text, setText] = useState('');
  const { mutate: addTask } = useAddTask(boardId, page);
  const { mutate: updateTask } = useUpdateTask(boardId, page);

  const editingTask = useUIStore((s) => s.editingTask);
  const setEditingTask = useUIStore((s) => s.setEditingTask);

  useEffect(() => {
    if (editingTask) {
      setText(editingTask.text);
    }
  }, [editingTask]);

  const handleAddOrEdit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    if (editingTask) {
      updateTask({ id: editingTask.id, text: trimmed });
      setEditingTask(null);
    } else {
      addTask(trimmed);
    }

    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAddOrEdit();
  };

  const handleCancel = () => {
    setEditingTask(null);
    setText('');
  };

  return (
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
  );
};

export default TaskForm;
