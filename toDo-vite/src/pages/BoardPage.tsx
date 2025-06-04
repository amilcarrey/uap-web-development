import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import TaskList from "../components/TaskList";
import type { TaskFilter } from "../types";

import Header from "../components/Header";
import { useBoardStore } from "../stores/useBoardStore";

export default function BoardPage() {
  const { boardId } = useParams({ from: "/board/$boardId" });
  const [filter, setFilter] = useState<TaskFilter>("all");
  const { boards } = useBoardStore();

   const boardName = boards.find(b => b.id === boardId)?.name ?? "Tablero";

  return (
    <>
    <Header boardId={boardId} />

    <div className="p-4">
      <h2 className="text-xl text-white mb-4">Tablero: {boardName}</h2>
      <TaskList boardId={boardId} filter={filter} onFilter={setFilter} />
    </div>
    </>
  );
  
}
