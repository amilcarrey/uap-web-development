//src\components\TaskItem.tsx

import { useTaskOperations } from "../../hooks/useTaskOperations";
import { useConfigStore } from '../../stores/configStore';
import { TaskItemEditForm } from './TaskItemEditForm';
import { TaskItemActions } from './TaskItemActions';
import { TaskItemDisplay } from './TaskItemDisplay';
import type { Task } from '../../types/task';

// Props que recibe este componente:
// - task: la tarea a mostrar
// - tabId: ID de la pestaña (para saber de qué lista viene la tarea)
interface Props {
  task: Task;
  tabId: string;
}

/**
 * Componente TaskItem
 * Representa una tarea individual en la lista de tareas.
 * Permite marcar la tarea como completada, editar su texto o eliminarla.
 * Utiliza React Query para mutaciones (toggle, delete, edit) y Zustand para el estado global de edición.
 * 
 * La lógica de negocio está separada en useTaskOperations y la UI en subcomponentes.
 *
 * Props:
 * - task: Objeto con los datos de la tarea (id, texto, completada)
 * - tabId: ID de la pestaña a la que pertenece la tarea
 */
export function TaskItem({ task, tabId }: Props) {
  const upperCase = useConfigStore(state => state.upperCaseDescription);

  // Hook para todas las operaciones de la tarea
  const {
    isViewer,
    isEditingMode,
    editText,
    setEditText,
    isToggling,
    isDeleting,
    isEditing,
    handleToggle,
    handleDelete,
    handleEdit,
    handleCancelEdit,
    handleStartEdit
  } = useTaskOperations(task, tabId);

  return (
    <li
      className={`task-item 
        flex items-center justify-between py-[10px] border-b border-[#d3d3d3]
        ${task.active ? "line-through opacity-70" : ""}`}
    >
      {isEditingMode ? (
        <TaskItemEditForm
          editText={editText}
          setEditText={setEditText}
          onSubmit={handleEdit}
          onCancel={handleCancelEdit}
          isDisabled={isEditing}
        />
      ) : (
        <>
          <TaskItemDisplay
            content={task.content}
            isViewer={isViewer}
            upperCase={upperCase}
            onToggle={handleToggle}
            isToggling={isToggling}
          />

          <TaskItemActions
            isViewer={isViewer}
            onEdit={handleStartEdit}
            onDelete={handleDelete}
            isEditingDisabled={isEditing}
            isDeletingDisabled={isDeleting}
          />
        </>
      )}
    </li>
  );
}
