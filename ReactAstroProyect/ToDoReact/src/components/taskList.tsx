import TaskItem from './taskItem';
import type { Task } from '../types'; // Conservamos el tipo

type TaskListProps = {
  tasks: Task[];
  onDeleteTask: (id: number) => void;
  onToggleCompletion: (id: number) => void;
  onEditTasks: (id: number, text: string) => void; // Agregamos la función para editar tareas
};

function TaskList({ tasks, onDeleteTask, onToggleCompletion, onEditTasks }: TaskListProps) {
  return (
    <div className="Main flex flex-col gap-[10px] m-[10px] mx-auto bg-[antiquewhite] w-[80%] p-[20px] max-w-[1200px] mt-[10px] rounded-[10px]">
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