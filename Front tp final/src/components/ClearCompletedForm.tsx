
import { useMatch } from "@tanstack/react-router";
import { useTasks } from "../hooks/useTasks";
import { useClearCompleted } from "../hooks/useClearCompleted";


export default function ClearCompletedForm() {
  const {
    params: { boardId },
  } = useMatch({ from: "/reminder/$boardId" });

  const { data } = useTasks(boardId);
  const { mutate, isPending } = useClearCompleted();

  const reminders = data ?? [];
  const hasCompleted = reminders.some((r:any) => r.completed);

  if (!hasCompleted) return null;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutate(boardId);
      }}
      className="my-4"
    >
      <button
        disabled={isPending}
        className="w-full bg-red-100 text-red-700 p-2 rounded"
      >
        {isPending ? "Limpiando..." : "Limpiar completadas"}
      </button>
    </form>
  );
}


