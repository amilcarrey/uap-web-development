// src/components/ClearCompletedButton.tsx
import { useClearCompleted } from "../hooks/useClearCompleted";

interface ClearCompletedButtonProps {
  boardId: string;
  hasCompleted: boolean;
}

export function ClearCompletedButton({ boardId, hasCompleted }: ClearCompletedButtonProps) {
  const clearCompleted = useClearCompleted();

  if (!hasCompleted) return null;

  return (
    <button
      onClick={() => clearCompleted.mutate(boardId)}
      disabled={clearCompleted.isPending}
      className="mt-6 w-full bg-red-100 hover:bg-red-200 text-red-700 font-medium p-3 rounded-xl transition disabled:opacity-70"
    >
      {clearCompleted.isPending ? "Limpiando…" : "Eliminar completados"}
    </button>
  );
}
