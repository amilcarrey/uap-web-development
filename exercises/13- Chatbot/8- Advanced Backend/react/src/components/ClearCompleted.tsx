import { useClearCompletedTodos } from "../hooks/UseTodoMutations";
import { addNotification } from "../store/uiSlice";
import { useAppDispatch } from "../store/hooks";


// import { useQueryClient } from "@tanstack/react-query";

export function ClearCompletedWithContext() {
    // Usamos el hook que ahora internamente ya usa el contexto
    const clearCompleted= useClearCompletedTodos();
    const dispatch = useAppDispatch();
    // const queryClient = useQueryClient();
    // const queryData = queryClient.getQueriesData({ queryKey: ['todos'] });
    // console.log("ClearCompletedWithContext queryClient:", queryClient.getQueriesData({ queryKey: ['todos'] }));

    function handleClearCompleted() {
        clearCompleted.mutate(undefined, {
            onSuccess: (data) => {

                if (data > 0) {
                    dispatch(addNotification({
                        message: "Completed tasks cleared successfully!",
                        type: 'success' 
                    }))
                } else {
                    dispatch(addNotification({
                    message: "No completed tasks to clear!!!",
                    type: 'warning'
                    })) 
                }
            },
            onError: (error) => {
                dispatch(addNotification({
                    message: `Error clearing completed tasks: ${error.message}`,
                    type: 'error'
                }))
            }
        });
    }

    return (
        <div>
            <button 
                type="button" 
                onClick={handleClearCompleted}
                disabled={clearCompleted.isPending}
                className="text-orange-500 mx-8 my-2 mt-24 ml-auto block text-right cursor-pointer border-0 bg-transparent"
            >
                {clearCompleted.isPending ? "Clearing..." : "Clear Completed"}
            </button>
        </div>
    );
}
