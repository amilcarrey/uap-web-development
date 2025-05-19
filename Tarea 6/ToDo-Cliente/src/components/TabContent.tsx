//src\components\TabContent.tsx

import { useState } from 'react';
import { TaskInput } from './TaskInput';            // Componente para ingresar nuevas tareas
import { TaskList } from './TaskList';              // Componente que muestra la lista de tareas
import { FilterControls } from './FilterControls';  // Componente para cambiar el filtro (ver todas, completadas, etc.)

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
  tasks: Task[];               // Lista inicial de tareas que se le pasa desde el padre
  currentFilter: string;       // Filtro actual aplicado a la lista (por ejemplo: "all", "completed", "pending")
}

/**
 * Componente TabContent
 * Este es el corazón de cada pestaña de tareas. Se encarga de mostrar el input, la lista de tareas y los filtros.
 * Además, maneja su propio estado interno de tareas, independiente del componente padre.
 */
export function TabContent({
  tabId,
  title,
  isActive = false,
  tasks: initialTasks,
  currentFilter
}: Props) {
  // Estado local para manejar las tareas. Arranca con las que se le pasaron desde props.
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  // Estado local para el filtro actual (puede ser 'all', 'completed' o 'active')
  const [filter, setFilter] = useState<string>(currentFilter);

  /**
   * Cambia el filtro activo y actualiza el estado.
   * @param newFilter - nuevo filtro seleccionado ("all", "completed", "active")
   */
  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  };

  /**
   * Elimina todas las tareas que están marcadas como completadas.
   * Filtra el array para quedarse solo con las pendientes.
   */
  const handleClearCompleted = () => {
    setTasks(prev => prev.filter(task => !task.completed));
  };


  /**
   * handleTaskAdded
   * Función que se ejecuta cuando se agrega una nueva tarea desde el input.
   * Recibe la nueva tarea y la agrega al array existente usando spread.
   */
  const handleTaskAdded = (newTask: Task) => {
    setTasks(prev => [...prev, newTask]);
  };

  /**
   * handleToggle
   * Marca una tarea como completada o no completada.
   * Recorre la lista y, si encuentra la tarea con el id que recibió, cambia su propiedad `completed`.
   */
  const handleToggle = (taskId: string, completed: boolean) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, completed } : task
      )
    );
  };

  /**
   * handleDelete
   * Elimina una tarea según su id.
   * Filtra el array de tareas, dejando fuera la que coincida con el id recibido.
   */
  const handleDelete = (taskId: string) => {
    setTasks(prev =>
      prev.filter(task => task.id !== taskId)
    );
  };


    // Filtramos según el estado filter antes de mostrar
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true; // 'all'
  });

  return (
    <section
      id={tabId}
      // Mostramos el contenido solo si la pestaña está activa; si no, lo ocultamos con "hidden"
      className={`tab-content ${isActive ? 'active block' : 'hidden'}`}
    >
      {/* Título visible de la pestaña */}
      <h3>{title}</h3>

      {/* Componente que permite ingresar nuevas tareas. Le pasamos el id y la función para agregar tareas */}
      <TaskInput tabId={tabId} onTaskAdded={handleTaskAdded} />

      {/* Lista actual de tareas. Le pasamos las tareas y las funciones para marcar como completada o eliminar */}
      <TaskList
        tasks={filteredTasks}
        tabId={tabId}
        onToggle={handleToggle}
        onDelete={handleDelete}
      />

      {/* Controles para aplicar filtros (todas, completadas, pendientes). Todavía no manejamos su lógica acá. */}
      <FilterControls
        tabId={tabId}
        currentFilter={filter}
        onFilterChange={handleFilterChange}
        onClearCompleted={handleClearCompleted}
      />
    </section>
  );
}
