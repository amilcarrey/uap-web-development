import Task from "./Task";
import type { Task as TaskType } from "../types";
import TaskFilters from "./TaskFilters";


type TaskListProps = {
    tasks: TaskType[];
    onComplete: (id: string) => void;
    onDelete: (id: string) => void;
    onClearCompleted: () => void;
    onFilter: (filter: string) => void;

};

function TaskList({ tasks, onComplete, onDelete, onClearCompleted, onFilter }: TaskListProps) {
    return (
        <div className="flex flex-col w-2xl  bg-gray-950 rounded-2xl mt-10qd p-5">
            <TaskFilters onFilter={onFilter} />
            <ul className="flex flex-col items-center">
                {tasks.map((task) => (
                    <Task
                        key={task.id}
                        task={task}
                        onComplete={onComplete}
                        onDelete={onDelete}
                    />
                ))}
            </ul>
            <button type="submit" onClick={() => onClearCompleted()} className="cursor-pointer ml-auto text-lg p-2 border-2 border-blue-500 rounded-md hover:text-blue-700" >Clear Completed</button>
        </div>

    )
}
export default TaskList; 