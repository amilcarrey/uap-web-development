import TaskItem from './taskItem';
import type { Task } from '../types'; 

type TaskListProps = {
  tasks: Task[];
  onDeleteTask: (id: number) => void;
  onToggleCompletion: (id: number) => void;
  onEditTasks: (id: number, text: string) => void; 
    currentCategory?: {
    userRole?: 'owner' | 'editor' | 'viewer';
    isShared?: boolean;
  };
};

function TaskList({ tasks, onDeleteTask, onToggleCompletion, onEditTasks, currentCategory }: TaskListProps) {

  const getBackgroundColor = () => {
    if (!currentCategory?.isShared) {
      return "bg-[antiquewhite]"; // Color original para categorías propias
    }

    // Categorías compartidas
    switch (currentCategory.userRole) {
      case 'owner':
        return "bg-green-400"; // Verde owners compartidos
      case 'editor':
        return "bg-red-400"; // rojo editor
      case 'viewer':
        return "bg-blue-400"; // Azul  viewers
      default:
        return "bg-[antiquewhite]";
    }
  };

  return (
    <div className={`Main flex flex-col gap-[10px] m-[10px] mx-auto ${getBackgroundColor()} w-[80%] p-[20px] max-w-[1200px] mt-[10px] rounded-[10px]`}>
      <div className="Tasks flex flex-col items-center space-y-[20px]" id="task-list">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskItem
              key={task.id} // clave única para cada tarea
              task={task} // pasamos la tarea como prop a TaskItem
              onDelete={() => onDeleteTask(task.id)} 
              onToggleCompletion={() => onToggleCompletion(task.id)} //funcion flecha que se pasa como prop a TaskItem
              onEditTasks={(text) => onEditTasks(task.id, text)} 
            />
          ))
        ) : (
          <p>No hay tareas disponibles.</p>
        )}
      </div>
    </div>
  );
}
export default TaskList;