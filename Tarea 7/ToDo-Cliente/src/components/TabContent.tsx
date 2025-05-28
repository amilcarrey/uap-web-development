//src\components\TabContent.tsx

import { TaskInput } from './TaskInput';            // Componente para ingresar nuevas tareas
import { TaskList } from './TaskList';              // Componente que muestra la lista de tareas
import { FilterControls } from './FilterControls';  // Componente para cambiar el filtro (ver todas, completadas, etc.)
import { useTasks } from '../hooks/task';
import { useUIStore } from '../stores/uiStore';
import { useMemo } from 'react';

// Estructura base de una tarea: un identificador, un texto y si está completada o no
export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

// Props que recibe el componente TabContent, una por cada pestaña de tareas
export interface Props {
  tabId: string;                // ID único de la pestaña (para identificarla y filtrarla)
  title: string;               // Título que se muestra en la UI
  isActive: boolean;           // Indica si esta pestaña está visible o no
}

/**
 * Componente TabContent
 * Este componente representa el contenido de una pestaña de tareas.
 * Utiliza React Query para obtener las tareas desde el backend y Zustand para manejar el filtro global de tareas.
 * Muestra el input para agregar tareas, la lista filtrada de tareas y los controles de filtro.
 * El filtro de tareas (todas, completadas, activas) es global y compartido entre todas las pestañas.
 */
export function TabContent({
  tabId,
  title,
  isActive = false,
}: Props) {
  // Obtiene las tareas de la pestaña actual usando React Query.
  // Si no hay datos, se usa un array vacío por defecto.
  const { data: tasks = [], isLoading, isError } = useTasks(tabId);

  /*
   Zustand store para manejar el filtro global de tareas.
   - useUIStore es un hook que accede al estado global de la UI.
   - taskFilter es el filtro actual ('all', 'active', 'completed').
   - setTaskFilter es la función para cambiar el filtro.
   
   Esta parte permite que todas las pestañas compartan el mismo filtro de tareas,
   y se actualice en tiempo real cuando el usuario cambia el filtro.
   Obtiene el filtro global de tareas y la función para cambiarlo desde Zustand.
   taskFilter puede ser 'all', 'active' o 'completed'.
  */
  const taskFilter = useUIStore(state => state.taskFilter);
  const setTaskFilter = useUIStore(state => state.setTaskFilter);

  /*
   Filtra las tareas según el filtro global seleccionado.
   - 'active': solo muestra tareas no completadas
   - 'completed': solo muestra tareas completadas
   - 'all': muestra todas las tareas
  */
 const filteredTasks = useMemo(() => {
  if (taskFilter === "active") return tasks.filter((task: Task) => !task.completed);
  if (taskFilter === "completed") return tasks.filter((task: Task) => task.completed);
  return tasks; // Por defecto, devuelve todas las tareas si no hay filtro
}, [taskFilter, tasks]);


  return (
    <section
      id={tabId}
      // Solo muestra el contenido si la pestaña está activa
      className={`tab-content ${isActive ? 'active block' : 'hidden'}`}
    >
      {/* Título de la pestaña */}
      <h3>{title}</h3>

      {/* Input para agregar nuevas tareas */}
      <TaskInput tabId={tabId} onTaskAdded={() => {}} />

      {/* Muestra un mensaje de carga o error, o la lista de tareas filtradas */}
      {isLoading ? (
        <div>Cargando tareas...</div>
      ) : isError ? (
        <div>Error al cargar tareas</div>
      ) : (
        <TaskList tasks={filteredTasks} tabId={tabId} />
      )}

      {/* Controles para cambiar el filtro de tareas */}
      <FilterControls
        tabId={tabId}
        currentFilter={taskFilter}
        onFilterChange={setTaskFilter}
        onClearCompleted={() => {}}
      />
    </section>
  );
}
