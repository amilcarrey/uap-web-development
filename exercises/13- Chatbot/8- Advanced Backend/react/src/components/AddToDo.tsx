import { type FormEvent, useEffect, useRef } from "react";
import { useAddTodo, useEditTodo } from "../hooks/UseTodoMutations";
import type { Board } from "../types";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addNotification, cancelEditing, cancelCreatingBoard, setCurrentBoardId } from "../store/uiSlice";
import { useCreateBoard } from "../hooks/useBoardMutations";
import { useQueryClient } from "@tanstack/react-query";

export function AddToDo() {
    // Obtener estado de edición
    const { isEditing, todoBeingEdited } = useAppSelector(state => state.ui.editing);
    const isCreatingBoard = useAppSelector(state => state.ui.isCreatingBoard);
    
    // Hooks para añadir y editar tareas
    const { mutateAsync: addTodo, isPending: isAddPending } =  useAddTodo();
    const { mutate: editTodo, isPending: isEditPending } = useEditTodo();
    const {mutateAsync: createBoard, isPending: isBoardPending } = useCreateBoard();
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();
    
    // Referencia al input para enfocar automáticamente
    const inputRef = useRef<HTMLInputElement>(null);
    // Manejo del input al empezar la edicion o creacion de un tablero
    useEffect(() => {
        if (isEditing && inputRef.current) {
            // Establecer el texto del todo en el input
            inputRef.current.value = todoBeingEdited?.text || '';
            // Enfocar el input
            inputRef.current.focus();
        } else if (isCreatingBoard && inputRef.current) {
            // Vaciar el input
            inputRef.current.value = '';
            // Enfocar el input
            inputRef.current.focus();
        }
        
    }, [isEditing, todoBeingEdited, isCreatingBoard]);
    
    // Efecto para detectar la tecla Escape
    useEffect(() => {
        // Solo agregar el listener cuando estemos en modo edición o de creacion de un tablero
        if (isEditing || isCreatingBoard) {
            const handleEscapeKey = (event: KeyboardEvent) => {
                if (event.key === "Escape") {
                    handleCancelEdit();
                }
            };
            
            // Agregar listener global
            document.addEventListener('keydown', handleEscapeKey);
            
            // Limpieza cuando el componente se desmonte o isEditing cambie
            return () => {
                document.removeEventListener('keydown', handleEscapeKey);
            };
        }
    }, [isEditing, isCreatingBoard]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const target = event.target as HTMLFormElement;
        const formData = new FormData(target);
        const text = formData.get("text")?.toString() || '';

        if (!text.trim()) {
            dispatch(addNotification({
                message: "Please enter something!",
                type: 'warning'
            }));
            return;
        }

        if (isCreatingBoard) {
            // Modo creación de tablero
            try {
                const newBoard = await createBoard(text);

                dispatch(setCurrentBoardId(newBoard.id));
                
                dispatch(addNotification({
                    message: "Board created successfully!",
                    type: 'success'
                }));
                dispatch(cancelCreatingBoard())
                target.reset()
                return;
            } catch (error) {
                console.error("Error adding board:", error);
                dispatch(addNotification({
                    message: "Failed to submit. Please try again.",
                    type: 'error'
                }));
            }
            
        }

        if (isEditing && todoBeingEdited) {
            // Modo edición
            editTodo({ 
                id: todoBeingEdited.id, 
                text 
            }, {
                onSuccess: () => {
                    dispatch(addNotification({
                        message: "Task updated successfully!",
                        type: 'success'
                    }));
                    
                    // Cancelar modo edición
                    dispatch(cancelEditing());
                    target.reset();
                },
                onError: (error: any) => {
                    console.error('Error editing todo:', error);
                    dispatch(addNotification({
                        message: error?.message || 'Failed to update task. You might not have permission.',
                        type: 'error'
                    }));
                }
            });
            
            return;
        } else {
            // Modo añadir nueva tarea
    
                await addTodo(text, {
                    onSuccess: () => {
                        dispatch(addNotification({
                            message: "Task added successfully!",
                            type: 'success'
                        }));     
                    },
                    onError: (error: any) => {
                        console.error("Error adding todo:", error);
                        dispatch(addNotification({
                            message: error?.message || 'Failed to add task. You might not have permission.',
                            type: 'error'
                        }));
                    }
                });
        }
        
        // Resetear el formulario
        target.reset();
    }

    // Cancelar la edición
    function handleCancelEdit() {
        dispatch(cancelEditing());
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    }

    function handleCancelBoard() {
        dispatch(cancelCreatingBoard())
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    }

    const isPending = isCreatingBoard
        ? isBoardPending
        : isEditing
            ? isEditPending
            : isAddPending;

    return (
        <form 
            onSubmit={handleSubmit} 
            action="/api/todos" 
            method="POST" 
            className="flex items-center bg-[rgba(241,236,230,255)] my-6 rounded-full w-1/2 p-0"
        >
            <input 
                ref={inputRef}
                type="text" 
                name="text" 
                id="input-todo" 
                placeholder={isEditing ? "Update task..." : isCreatingBoard ? 
                "Name your new board..." : "What do you need to do?"}
                className="flex-grow bg-transparent border-0 font-montserrat text-lg p-3 ml-2 focus:outline-none" 
            />
            {isEditing || isCreatingBoard && (
                <button
                    type="button"
                    onClick={isEditPending ? handleCancelEdit : handleCancelBoard}
                    className="flex-shrink-0 bg-transparent text-gray py-3 px-4"
                >
                    ✕
                </button>
            )}
            
            <button 
                type="submit" 
                id="add-todo-btn" 
                name="action" 
                value={isEditing ? "edit" : isCreatingBoard ? "creating" : "add"}
                className="flex-shrink-0 bg-[rgb(116,178,202)] border-0 text-white text-2xl rounded-r-full py-3 px-5 cursor-pointer"
            >
                {isPending ? "..." : isEditing ? "UPDATE" : isCreatingBoard ? "CREATING" : "ADD"}
            </button>
        </form>
    );
}