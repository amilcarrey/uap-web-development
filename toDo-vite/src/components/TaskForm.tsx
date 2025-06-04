import { useState, useEffect, type FormEvent } from "react";
import { useAddTask } from "../hooks/useAddTask";
import { useEditTask } from "../hooks/useEditTask";
import { useToastStore } from "../stores/useToastStore";

type TaskFormProps = {
  taskToEdit?: { id: string; name: string };
  clearEdit?: () => void;
  inline?: boolean;
  boardId?: string;
};

function TaskForm({ taskToEdit, clearEdit, inline = false, boardId }: TaskFormProps) {
  const [text, setText] = useState(taskToEdit?.name || "");
  const { mutate: addTask, isPending, isError, error } = useAddTask();
  const { mutate: editTask, isPending: isEditPending, isError: isEditError, error: editError, } = useEditTask();

  const { showToast } = useToastStore();

  useEffect(() => {
    if (taskToEdit) {
      setText(taskToEdit.name);
    }
  }, [taskToEdit]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return alert("No puedes añadir una tarea vacía");

    if (taskToEdit) {
      editTask({ id: taskToEdit.id, name: trimmed },
        {
          onSuccess: () => {
            clearEdit?.();
            showToast("Tarea editada correctamente", "success");
            setText("");
          },
          onError: (err) => {
            showToast((err as Error).message || "Error al editar tarea", "error");
          }
        });

    } else {
      addTask({name:trimmed, boardId},{
        onSuccess: () => {
          showToast("Tarea agregada correctamente", "success");
          setText("");
        },
        onError: (err) => {
          showToast((err as Error).message || "Error al agregar tarea", "error");
        }

      })

    }





  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center ${inline ? "p-0 gap-2" : "mt-6 h-5"}`}
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={inline ? "" : "Añadir tarea"}
        disabled={isPending}
        className={`${inline
          ? "bg-transparent border-2 text-white text-center w-full"
          : "w-96 h-12 bg-gray-100 rounded-2xl rounded-r-none p-5 text-black placeholder:text-gray-400"
          }`}
      />

      {/* 🔁 Botones según modo */}
      {inline ? (
        <>
          <button
            type="submit"
            disabled={taskToEdit ? isEditPending : isPending}
            className="text-green-500 cursor-pointer hover:text-green-700"
            title="Guardar"
          >
            {isEditPending ? "..." : "✔"}
          </button>

        </>
      ) : (
        <button
          type="submit"
          disabled={isPending}
          className="bg-gray-950 h-12 w-14 rounded-bl-none rounded-br-xl rounded-tr-xl cursor-pointer text-amber-50 border border-transparent hover:border-blue-700 transition-colors duration-300"
        >
          {isPending ? "..." : "ADD"}
        </button>
      )}
      {isError && error && (
        <p className="text-red-500 text-sm ml-4">
          {(error as Error).message}
        </p>
      )}

      {isEditError && editError && (
        <p className="text-red-500 text-sm ml-4">
          {(editError as Error).message}
        </p>
      )}
    </form>
  );
}

export default TaskForm;
