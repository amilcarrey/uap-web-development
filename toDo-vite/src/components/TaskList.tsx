import Task from "./Task";
import type { Task as TaskType } from "../types";
import TaskFilters from "./TaskFilters";
import type { TaskFilter } from "../types";
import { useState } from "react";

import { useTasks } from "../hooks/useTasks";

import { useClearComplete } from "../hooks/useClearComplete";
import TaskForm from "./TaskForm";
import Pagination from "./Pagination";
import { usePaginationStore } from "../stores/usePaginationStore";
import { useSettingsStore } from "../stores/useSettingsStore";

type TaskListProps = {
    boardId?: string;
    filter:TaskFilter
    onFilter: (filter: TaskFilter) => void;
};

function TaskList({boardId, filter, onFilter }: TaskListProps) {
    const { data, isPending, isError, error } = useTasks(filter, boardId);
    const { mutate: clearComplete } = useClearComplete();
    const [taskToEdit, setTaskToEdit] = useState<TaskType | undefined>(undefined);
    const { setPage } = usePaginationStore();
    const { uppercaseDescriptions } = useSettingsStore();

    if (isPending) return <p className="text-white">Cargando tareas...</p>;
    if (isError) return <p className="text-red-500">{(error as Error).message}</p>;


    return (
        <div className="w-2xl flex flex-col items-center gap-5">
            <TaskForm
                taskToEdit={taskToEdit}
                clearEdit={() => setTaskToEdit(undefined)}
                boardId={boardId}
            />

            <div className="flex flex-col w-full bg-gray-950 rounded-2xl mt-6 p-5">
                <TaskFilters onFilter={(newFilter) =>{
                    setPage(1)
                    onFilter(newFilter)
                }}/>

                <ul className="flex flex-col items-center">
                    {data?.tasks.map((task) => (
                        <Task
                            key={task.id}
                            task={task}
                            uppercase={uppercaseDescriptions} 
                        />
                    ))}
                </ul>
                <Pagination totalPages={data.totalPages} />

                <button
                    type="submit"
                    onClick={() => clearComplete()}
                    className="cursor-pointer ml-auto text-lg p-2 border-2 border-blue-500 rounded-md hover:text-blue-700"
                >
                    Clear Completed
                </button>
            </div>
        </div>
    );


}
export default TaskList; 