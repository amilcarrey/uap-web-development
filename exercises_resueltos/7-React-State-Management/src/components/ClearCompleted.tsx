import { useClearCompleted } from "../hooks/tasks/useClearCompleted";

export const ClearCompleted = () => {
  const clearCompleted = useClearCompleted();
  return (
    <button
      onClick={() => clearCompleted.mutate()}
      className="text-orange-500 hover:underline text-sm mt-4 block ml-auto"
    >
      Clear Completed
    </button>
  );
};