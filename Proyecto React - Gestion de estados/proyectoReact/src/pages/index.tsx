import type { Task } from '../types';
// import { ToastContainer } from "../components/ToastContainer";
import { NewTaskForm } from "../components/NewTaskForm";
import { TaskList } from "../components/TaskList";
import { useEffect, useState } from "react";
import { FiltersForm } from "../components/FiltersForm";
import { ClearCompleted } from "../components/ClearCompleted";
import { useFilterStore } from "../store/useFilterStore";
import { useParams } from '@tanstack/react-router';
import { BoardsNav } from '../components/BoardsNav';
import { useBoardStore } from '../store/useBoardStore';


export function Index() {
  const filter = useFilterStore((state) => state.filter);
  const { boardId = "general" } = useParams({ strict: false }); //strict: false allows for optional boardId, strict: true would require it to be present
  const setFilter = useFilterStore((state) => state.setFilter);
  const [page, setPage] = useState(1);
  const [taskEditing, setTaskEditing] = useState<Task | null>(null);

  useEffect(() => {
    setPage(1); // Reset page to 1 when filter changes
  }, [filter]);

  useEffect(() => {
    useBoardStore.setState({ activeBoardId: boardId });
  }, [boardId]);

  return (
    <>
      <BoardsNav />
      <FiltersForm />

      <main>
        <NewTaskForm page={page} setPage={setPage} taskEditing={taskEditing} setTaskEditing={setTaskEditing} />
        <TaskList boardId={boardId} page={page} setPage={setPage} setTaskEditing={setTaskEditing} />
        <ClearCompleted boardId={boardId} />
      </main>
    </> 
  );
}