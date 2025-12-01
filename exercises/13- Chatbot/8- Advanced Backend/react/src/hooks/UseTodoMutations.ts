import {useMutation, useQueryClient} from '@tanstack/react-query';
import { useAppSelector } from '../store/hooks';
import { todoService } from '../services/todoService';
// import { useFilter } from '../context/FilterContext';



/**
 * Hook para agregar una nueva tarea
 * */
export function  useAddTodo() {
    const queryClient = useQueryClient();
    const currentBoardId = useAppSelector((state) => state.ui.currentBoardId)
    
    return useMutation({
        mutationFn: async (text: string) => {
            if (currentBoardId === null) {
                throw new Error('No board selected. Please select a board first.');
            }
            return await todoService.createTodo(currentBoardId, { text });
        },
        onSuccess: () => {
            // Invalidar cache para actualizar datos
            queryClient.invalidateQueries({queryKey: ['todos', currentBoardId]});
        },
        onError: (error) => {
            console.error("Error adding todo:", error);
            return error;
        }
    })
}

/** * 
 * Hook para eliminar una tarea
 * */
export function useDeleteTodo() {
    const queryClient = useQueryClient();
    const currentBoardId = useAppSelector((state) => state.ui.currentBoardId)
    
    return useMutation({
        mutationFn: async (id: number) => {
            if (currentBoardId === null) {
                throw new Error('No board selected. Please select a board first.');
            }
            await todoService.deleteTodo(currentBoardId, id);
            return id; // Retornamos el ID para usar en onSuccess
        },
        onSuccess: (deletedId) => {
            // Actualizar cache directamente
            queryClient.setQueryData(
                ['todos', currentBoardId],
                (oldData: any) => {
                    if (!oldData || !oldData.todos) return oldData;
                    
                    // Filtrar el todo eliminado
                    const updatedTodos = oldData.todos.filter((todo: any) => todo.id !== deletedId);
                    const updatedCount = updatedTodos.length;
                    
                    // Retornar los datos actualizados
                    return { ...oldData, todos: updatedTodos, totalItems: updatedCount };
                }
            )

            // Invalidar cache para actualizar datos
            queryClient.invalidateQueries({
                queryKey: ['todos', currentBoardId],
                exact: false
            });
        },
        onError: (error) => {
            console.error("Error deleting todo:", error);
            return error;
        }
    })
}

/**
 * Hook para marcar/desmarcar una tarea como completada
 * */
export function useToggleTodo() {
    const queryClient = useQueryClient();
    const currentBoardId = useAppSelector((state) => state.ui.currentBoardId)
    
    return useMutation({
        mutationFn: async (id: number) => {
            if (currentBoardId === null) {
                throw new Error('No board selected. Please select a board first.');
            }
            return await todoService.toggleTodo(currentBoardId, id);
        },
        onSuccess: () => {
            // Invalidar cache para actualizar datos
            queryClient.invalidateQueries({queryKey: ['todos', currentBoardId]});
        },
        onError: (error) => {
            console.error("Error toggling todo:", error);
            return error;
        }
    })
}

/**
 * Hook para editar una tarea
 * */
export function useEditTodo() {
    const queryClient = useQueryClient();
    const currentBoardId = useAppSelector((state) => state.ui.currentBoardId)

    return useMutation({
        mutationFn: async ({id, text}: {id: number, text: string}) => {
            if (currentBoardId === null) {
                throw new Error('No board selected. Please select a board first.');
            }
            return await todoService.updateTodo(currentBoardId, id, { text });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['todos', currentBoardId]})
        },
        onError: (error) => {
            console.error("Error editing todo:", error);
            return error;
        }
    })
}

/**
 * Hook para limpiar todos los todos completados
 * */
export function useClearCompletedTodos() {
    const queryClient = useQueryClient();
    const currentBoardId = useAppSelector((state) => state.ui.currentBoardId)

    return useMutation({
        mutationFn: async () => {
            if (currentBoardId === null) {
                throw new Error('No board selected. Please select a board first.');
            }
            console.log("Limpiando todos completados en el board:", currentBoardId);
            const result = await todoService.clearCompleted(currentBoardId);
            console.log("Todos completados eliminados:", result);
            return result;

        },
        onSuccess: () => {
            // Invalidar cache para actualizar datos
            queryClient.invalidateQueries({queryKey: ['todos', currentBoardId]});
        },
        onError: (error) => {
            console.error("Error clearing completed todos:", error);
            return error;
        }
    })
}

