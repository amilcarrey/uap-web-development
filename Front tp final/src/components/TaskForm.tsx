// src/components/TaskForm.tsx
import { useEffect, useState } from "react";
import { useTaskStore } from "../store/taskStore";
import { useUserConfig } from "../hooks/useUserConfig";
import { useAddTask } from "../hooks/useAddTask";
import { useUpdateTask } from "../hooks/useUpdateTask";
import { Plus, Save, X } from "lucide-react";

// Definir la interfaz de props
interface TaskFormProps {
  boardId: string;
}

export default function TaskForm({ boardId }: TaskFormProps) {
  const {
    selectedTask,
    editingText,
    setEditingText,
    setSelectedTask,
  } = useTaskStore();

  // Usar configuraciones del servidor en lugar del store local
 // TODO: Obtener del usuario autenticado
  const { data: config } = useUserConfig();
  const uppercaseDescriptions = config?.uppercase_descriptions ?? false;

  const isEditing = !!selectedTask;
  const [text, setText] = useState(editingText);

  const addTask = useAddTask(boardId);
  const editTask = useUpdateTask();

  // Cargar texto de la tarea seleccionada
  useEffect(() => {
    if (selectedTask) {
      const taskText = (selectedTask as any).name || (selectedTask as any).text || (selectedTask as any).title;
      setText(taskText);
      setEditingText(taskText);
    }
  }, [selectedTask, setEditingText]);

  // Manejar cambios en editingText cuando no hay tarea seleccionada
  useEffect(() => {
    if (!selectedTask) {
      setText(editingText);
    }
  }, [editingText, selectedTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    const finalText = uppercaseDescriptions ? trimmed.toUpperCase() : trimmed;

    if (isEditing && selectedTask) {
      editTask.mutate({ 
        id: String(selectedTask.id), 
        name: finalText, 
        board_id: boardId 
      });
      setSelectedTask(null);
    } else {
      addTask.mutate({ 
        name: finalText, 
        board_id: boardId 
      });
    }

    setText("");
    setEditingText("");
  };

  const handleCancel = () => {
    setText("");
    setEditingText("");
    setSelectedTask(null);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center mb-4">
      <input
        type="text"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          if (!selectedTask) {
            setEditingText(e.target.value);
          }
        }}
        placeholder="Escribe una tarea"
        className="flex-1 rounded-xl border border-pink-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-shadow duration-200"
      />
      
      <button 
        type="submit"
        disabled={addTask.isPending || editTask.isPending}
        className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-xl font-medium transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isEditing ? (
          <>
            <Save className="w-4 h-4" />
            {editTask.isPending ? "Guardando..." : "Guardar"}
          </>
        ) : (
          <>
            <Plus className="w-4 h-4" />
            {addTask.isPending ? "Agregando..." : "Agregar"}
          </>
        )}
      </button>

      {isEditing && (
        <button 
          type="button" 
          onClick={handleCancel}
          className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Cancelar
        </button>
      )}
    </form>
  );
}