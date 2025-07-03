import { useEffect, useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import TaskFilter from "../components/TaskFilter";
import { useAppStore } from "../store/useAppStore";
import { useConfigStore } from "../store/useConfigStore";
import { toast } from "react-toastify";

export default function Home() {
  const { filter, selectedBoard } = useAppStore();
  const refetchInterval = useConfigStore((s) => s.refetchInterval);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tasks/${selectedBoard}`, {
        credentials: "include",
      });
      const data = await res.json();
      setTasks(data);
    } catch {
      toast.error("Error al cargar tareas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    const id = setInterval(fetchTasks, refetchInterval);
    return () => clearInterval(id);
  }, [selectedBoard, refetchInterval]);

  const handleAdd = async (text: string) => {
    try {
      const res = await fetch(`/api/tasks/${selectedBoard}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error();
      toast.success("Tarea agregada");
      fetchTasks();
    } catch {
      toast.error("Error al agregar");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      toast.success("Tarea eliminada");
      fetchTasks();
    } catch {
      toast.error("Error al eliminar");
    }
  };

  const handleToggle = async (id: number) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      fetchTasks();
    } catch {
      toast.error("Error al cambiar estado");
    }
  };

  const handleEdit = async (id: number, text: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error();
      toast.success("Tarea editada");
      fetchTasks();
    } catch {
      toast.error("Error al editar");
    }
  };

  const filtered = tasks.filter((t: any) => {
    if (filter === "completed") return t.completed;
    if (filter === "active") return !t.completed;
    return true;
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#fffaf0]">
      <div className="bg-white rounded shadow w-full max-w-md p-6">
        <h1 className="text-2xl font-bold mb-4">Tablero: {selectedBoard}</h1>
        <TaskForm onAdd={handleAdd} />
        {loading ? (
          <p>Cargando tareas...</p>
        ) : (
          <>
            <TaskList
              tasks={filtered}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
            <TaskFilter filter={filter} setFilter={useAppStore().setFilter} />
          </>
        )}
      </div>
    </div>
  );
}