import type { Task } from '../types';
// import { ToastContainer } from "../components/ToastContainer";
import { NewTaskForm } from "../components/NewTaskForm";
import { TaskList } from "../components/TaskList";
import { useEffect, useState } from "react";
import { FiltersForm } from "../components/FiltersForm";
import { ClearCompleted } from "../components/ClearCompleted";
import { useFilterStore } from "../store/useFilterStore";
import { useParams , Link, useNavigate} from '@tanstack/react-router';
import { BoardsNav } from '../components/BoardsNav';
import { useBoardStore } from '../store/useBoardStore';
import { useAuth } from "../hooks/useAuth";
import { useBoards } from "../hooks/useBoards";
import { LogoutButton } from '../components/LogoutButton';
import { ShareBoardModal } from '../components/ShareBoardModal';
import { BoardRoleBadge } from '../components/BoardRoleBage';


export function Index() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const { boardId } = useParams({ strict: false }); //strict: false allows for optional boardId, strict: true would require it to be present
  const { data: boards } = useBoards();

  // Si no está logueado, redirigir a /auth
  useEffect(() => {
    if (!token) {
      navigate({ to: "/auth" });
    }
  }, [token, navigate]);

  useEffect(() => {
    if (token && !boardId && boards?.length) {
      navigate({ to: `/boards/${boards[0].id}` });
    }
  }, [token, boardId, boards]);

  const [showShareModal, setShowShareModal] = useState(false);
  const filter = useFilterStore((state) => state.filter);
  const setFilter = useFilterStore((state) => state.setFilter);
  const [page, setPage] = useState(1);
  const [taskEditing, setTaskEditing] = useState<Task | null>(null);

  useEffect(() => {
    setPage(1); // Reset page to 1 when filter changes
  }, [filter]);

  useEffect(() => {
    useBoardStore.setState({ activeBoardId: boardId });
  }, [boardId]);

  if (!token || !boardId) return null;

  return (
    <>
      <LogoutButton />
      {boardId && <BoardRoleBadge boardId={boardId} />}
      <Link
        to="/settings"
        className="fixed top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition"
        title="Settings"
      >
        ⚙️
      </Link>

      <button
        onClick={() => setShowShareModal(true)}
        className="fixed top-4 right-15 p-2 bg-[#65b8d8] text-white rounded-md shadow-lg hover:bg-[#4a9cbd] transition cursor-pointer"
      >
        Share Board
      </button>

      <BoardsNav />
      <FiltersForm />

      <main>
        <NewTaskForm page={page} setPage={setPage} taskEditing={taskEditing} setTaskEditing={setTaskEditing} />
        <TaskList page={page} setPage={setPage} setTaskEditing={setTaskEditing} />
        <ClearCompleted />
      </main>

      { showShareModal && (
        <ShareBoardModal boardId={boardId} onClose={() => setShowShareModal(false)} />
      )}
    </> 
  );
}