// src/pages/Reminders.tsx
import { useMatch } from "@tanstack/react-router";
import { useTasks } from "../hooks/useTasks";
import { useTaskStore } from "../store/taskStore";
import CreateReminder from "../components/CreateReminder";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { RemindersHeader } from "../components/RemindersHeader";
import { SearchInput } from "../components/SearchInput";
import { TaskList } from "../components/TaskList";
import { Pagination } from "../components/Pagination";
import { FilterButtons } from "../components/FilterButtons";
import { InviteUserModal } from "../components/InviteUserModal";
import { ClearCompletedButton } from "../components/ClearCompletedButton";
import { useBoards } from "../hooks/useBoard"; 
import { useUsers } from "../hooks/useUsers";
import { useDebounce } from "../utils/useDobounce"; 
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const FILTERS = [
  { key: "all", label: "Todos" },
  { key: "completed", label: "Completados" },
  { key: "incomplete", label: "Pendientes" },
];

export default function RemindersPage() {
  const {
    params: { boardId },
  } = useMatch({ from: "/reminder/$boardId" });

  const [page, setPage] = useState(1);
  const limit = 10;
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  const { data: boards } = useBoards();
  const { data: availableUsers = [] } = useUsers();
  const { user } = useAuth();
  const board = boards?.find((b: any) => b.id === boardId);
  const { filter, setFilter } = useTaskStore();

  const { data, isLoading, isError } = useTasks(boardId, page, limit);
  const reminders = data?.reminders ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;
  const hasCompleted = reminders.some((t: any) => t.completed);

  const filteredTasks = reminders.filter((task: any) => {
    const matchesStatus =
      filter === "completed" ? task.completed :
      filter === "incomplete" ? !task.completed :
      true;

    const matchesSearch = task.name?.toLowerCase().includes(debouncedSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (isLoading) return <p className="p-4 text-center">Cargando tareas…</p>;
  if (isError) return <p className="p-4 text-red-600 text-center">Error al cargar tareas</p>;

  // Solo mostrar botón de invitar si el usuario es el propietario del tablero
  const canInviteUsers = user && board && board.owner_id === user.id;

  const handleOpenInviteDialog = () => {
    setShowInviteDialog(true);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setPage(1); // Resetear a página 1 cuando cambie filtro
  };

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col">
      <RemindersHeader 
        board={board}
        canInviteUsers={canInviteUsers}
        onInviteClick={handleOpenInviteDialog}
      />

      <main className="flex-1 p-6 overflow-y-auto">
        <CreateReminder boardId={boardId} />
        
        <SearchInput 
          value={search}
          onChange={setSearch}
          placeholder="Buscar recordatorios por nombre..."
        />

        <TaskList tasks={filteredTasks} boardId={boardId} />

        <Pagination 
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        <ClearCompletedButton 
          boardId={boardId}
          hasCompleted={hasCompleted}
        />

        <ConfirmDeleteModal />

        <InviteUserModal 
          isOpen={showInviteDialog}
          onClose={() => setShowInviteDialog(false)}
          boardId={boardId}
          users={availableUsers ?? []}
        />
      </main>

      <FilterButtons 
        filters={FILTERS}
        currentFilter={filter}
        onFilterChange={handleFilterChange}
        onPageReset={() => setPage(1)}
      />
    </div>
  );
}