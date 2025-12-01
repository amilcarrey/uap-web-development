import { ToDoItem } from "./ToDoItem";
// import { usePagination } from "../context/PaginationContext";
import { useTodos } from "../hooks/useTodos";
import type { TodoItem } from "../types";
import { Pagination } from "./Pagination";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setCurrentPage } from "../store/uiSlice";
import { useAuth } from "../context/AuthContext";


export function ToDoListWithContext() { 
    const { currentPage } = useAppSelector((state) => state.ui.pagination);
    const dispatch = useAppDispatch()
    
    // ✅ Obtener itemsPerPage de las configuraciones del usuario
    const { settings } = useAuth();
    const itemsPerPage = settings?.todos_per_page || 10;

    const { data, isLoading, isError, isFetching } = useTodos({ page: currentPage, limit: itemsPerPage });
    console.log('📊 Todos query state:', {
        isLoading: isLoading,
        isFetching:isFetching,
        data: data?.todos.length
  });

    const { todos, total} = data  || { todos: [], total: 0 };
    const totalPages = Math.ceil(total / itemsPerPage);

    console.log("totalPages:", totalPages, "\ntotalTodos:", total);



    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                <span className="ml-2">Loading tasks...</span>
            </div>
        );
    }
    
    if (isError) {
        return (
            <div className="text-red-500 p-4 text-center">
                Error loading tasks.
            </div>
        );
    }

    if (!todos || todos.length === 0) {
        // Si no hay mas tareas en la pagina actual, retrocedemos a la pagina anterior
        // para evitar que el usuario vea una pagina vacia
        if  (currentPage > 1) {
            dispatch(setCurrentPage(currentPage - 1)); 
            return;
        }
        return (
            <div className="text-gray-500 p-4 text-center">
                No available tasks
            </div>
        );
    }

    return (
        <>
            <ul className="list-none p-0 m-0">
                {todos.map((todo: TodoItem) => (
                    <ToDoItem
                        key={todo.id}
                        todo={todo}
                    />
                ))}
            </ul>    

            <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {dispatch(setCurrentPage(page))}}
            />

        </>
        
    );
}
