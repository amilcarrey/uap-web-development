import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../hooks/useTasks";
import type { Task } from "../types";
import type { TaskFilter } from "../hooks/useTasks";

type ClearCompletedProps = {
  filter: TaskFilter;
};

export function ClearCompleted({ filter }: ClearCompletedProps) {
  const queryClient = useQueryClient();
  const queryKey = ["tasks", filter];
  
  const { mutate: clearCompleted } = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${BASE_URL}/clear-completed`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data: Task[] = await response.json();
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return (
    <form method="POST" className="clear-completed-form" name="clear-completed-form" action="/api/clear-completed">
      <button type="submit" className="bg-[#d9534f] text-white py-2 px-5 rounded-[5px] mt-2 block mx-auto cursor-pointer hover:bg-[#c9302c]" name="clear-completed" onClick={(e) => {
        e.preventDefault();
        clearCompleted();
      }}>Clear Completed</button>
    </form>
  );
}