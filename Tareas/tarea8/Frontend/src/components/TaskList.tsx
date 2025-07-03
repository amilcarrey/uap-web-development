import { TaskItem } from "./TaskItem";
import { EmptyTasksMessage } from "./EmptyTasksMessage";

// 📌 Estructura de una tarea
export interface Task {
  id: string;          // ID único
  content: string;     // Descripción
  active: boolean;     // Estado: activa o completada
  boardId: string;     // ID del tablero
  createdAt: string;   // Fecha de creación
  updatedAt: string;   // Fecha de actualización
}

// 📦 Props del componente TaskList
export interface Props {
  tasks: Task[];         // Lista de tareas
  tabId: string;         // ID del tablero
  isLoading?: boolean;   // Indicador de carga
}

/**
 * 📋 TaskList
 * Muestra una lista de tareas o un mensaje si no hay ninguna.
 */
export function TaskList({ tasks, tabId, isLoading = false }: Props) {
  // 🕳️ Si no hay tareas, mostrar mensaje vacío
  if (tasks.length === 0) {
    return <EmptyTasksMessage boardId={tabId} isLoading={isLoading} />;
  }

  return (
    <ul className="task-list bg-indigo-50 p-6 rounded-xl mb-6 list-none shadow-sm border border-indigo-100">
      {/* 🧱 Renderizar cada tarea */}
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          tabId={tabId}
        />
      ))}
    </ul>
  );
}
