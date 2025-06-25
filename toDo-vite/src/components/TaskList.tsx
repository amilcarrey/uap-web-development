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
    const [searchQuery, setSearchQuery] = useState('');
    const [searchInput, setSearchInput] = useState('');
    
    const { data, isPending, isError, error } = useTasks(filter, boardId, searchQuery);
    const { mutate: clearComplete } = useClearComplete();
    const [taskToEdit, setTaskToEdit] = useState<TaskType | undefined>(undefined);
    const { setPage } = usePaginationStore();
    const { uppercaseDescriptions } = useSettingsStore();


    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchQuery(searchInput);
        setPage(1); 
    };

    const clearSearch = () => {
        setSearchInput('');
        setSearchQuery('');
        setPage(1);
    };

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
                <form onSubmit={handleSearch} className="w-full mb-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar tareas..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full p-2 pl-3 pr-10 border border-gray-600 bg-gray-800 rounded-md text-white"
                        />
                        {searchInput && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                                ✕
                            </button>
                        )}
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                            🔍
                        </button>
                    </div>
                </form>
                
                <TaskFilters onFilter={(newFilter) =>{
                    setPage(1)
                    onFilter(newFilter)
                }}/>

                <ul className="flex flex-col items-center">
                    {data?.tasks.length > 0 ? (
                        data.tasks.map((task) => (
                            <Task
                                key={task.id}
                                task={task}
                                uppercase={uppercaseDescriptions} 
                            />
                        ))
                    ) : (
                        <li className="text-gray-400 py-4">
                            {searchQuery 
                                ? "No se encontraron tareas que coincidan con tu búsqueda" 
                                : "No hay tareas en este tablero"}
                        </li>
                    )}
                </ul>
                <Pagination totalPages={data.totalPages} />

                <button
                    type="submit"
                    onClick={() => boardId && clearComplete(boardId)}
                    className="cursor-pointer ml-auto text-lg p-2 border-2 border-blue-500 rounded-md hover:text-blue-700"
                >
                    Clear Completed
                </button>
            </div>
        </div>
    );
}

export default TaskList;