import type { Task } from "../lib/tasks";

interface TaskItemProps {
  task: Task;
  onDelete: () => void;
  onToggleCompletion: () => void;
}

function TaskItem({ task, onDelete, onToggleCompletion }: TaskItemProps) {
  return (
      <div className="Task flex justify-between items-center w-[83%] p-[10px] rounded-[5px] bg-[rgb(83,57,88)]">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={onToggleCompletion}
            className={`checkTask appearance-none w-[47px] h-[40px] border-2 rounded-[8px] cursor-pointer relative transition-all duration-300
              text-white text-[14px]
              ${task.completed
                ? 'bg-green-600 border-green-600 after:content-["DONE"]'
                : 'border-gray-400 after:content-[""]'}
              after:absolute after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:pointer-events-none`}
            style={{ textAlign: "center" }}
        />
        <span   className={`flex-1 text-center transition-all duration-300 
          ${task.completed ? 'line-through text-gray-400' : 'text-white'}`}>
          {task.text}
        </span>
        <button
          onClick={onDelete}
          className="deleteTask flex items-center gap-2 bg-orange-400 text-white rounded-[5px] px-5 py-2 cursor-pointer text-[16px] hover:bg-[rgb(139,90,0)] transition"
          type="button">
          <i className="fas fa-trash"></i> Eliminar
        </button>
      </div>
  );
}

export default TaskItem;
