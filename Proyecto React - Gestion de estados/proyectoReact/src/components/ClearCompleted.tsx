import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../hooks/useTasks";
import type { Task } from "../types";
import { useFilterStore } from "../store/useFilterStore";
import { useBoardStore } from "../store/useBoardStore";
import { showToast } from "../utils/showToast";
import { canPerform } from "../utils/permissions";

export function ClearCompleted() {
  const filter = useFilterStore((state) => state.filter);
  const activeBoardId = useBoardStore((state) => state.activeBoardId)
  const currentRole = useBoardStore((state) => state.currentRole);
  const queryClient = useQueryClient();
  const queryKey = ["tasks", filter, activeBoardId];
  
  const { mutate: clearCompleted } = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${BASE_URL}/tasks/clear-completed?activeBoardId=${activeBoardId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  function handleClearCompleted() {
    if (!canPerform(currentRole, "clear")) {
      showToast("You do not have permission to clear completed tasks", "error");
      return;
    }
    clearCompleted();
  }

  return (
    <form method="POST" className="clear-completed-form" name="clear-completed-form" action="/api/clear-completed">
      <button type="submit" className="bg-[#d9534f] text-white py-2 px-5 rounded-[5px] mt-2 block mx-auto cursor-pointer hover:bg-[#c9302c]" name="clear-completed" onClick={(e) => {
        e.preventDefault();
        handleClearCompleted();
      }}>Clear Completed</button>
    </form>
  );
}