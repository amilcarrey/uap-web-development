import React, { useEffect, useState } from "react";

interface Task {
  id: number;
  content: string;
  completed: boolean;
}

interface Props {
  boardId: number;
  reload: boolean;
}

export const TasksList = ({ boardId, reload }: Props) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");

  // Filtros
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");

  // Paginación
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      let completed: boolean | undefined = undefined;
      if (filter === "completed") completed = true;
      else if (filter === "pending") completed = false;

      const url = new URL("http://localhost:4000/api/tasks");
      url.searchParams.append("boardId", boardId.toString());
      url.searchParams.append("page", page.toString());
      url.searchParams.append("search", search);
      if (completed !== undefined) url.searchParams.append("completed", completed.toString());

      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Error cargando tareas");

      const data = await res.json();
      setTasks(data.tasks);
      setTotalPages(data.totalPages);
    } catch {
      setError("Error cargando tareas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [boardId, reload, search, filter, page]);

  const toggleComplete = async (task: Task) => {
    try {
      await fetch(`http://localhost:4000/api/tasks/${task.id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed }),
      });
      fetchTasks();
    } catch {
      setError("Error actualizando tarea");
    }
  };

  const deleteTask = async (taskId: number) => {
    if (!window.confirm("¿Seguro que querés eliminar esta tarea?")) return;
    try {
      await fetch(`http://localhost:4000/api/tasks/${taskId}`, {
        method: "DELETE",
        credentials: "include",
      });
      fetchTasks();
    } catch {
      setError("Error eliminando tarea");
    }
  };

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingContent(task.content);
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditingContent("");
  };

  const saveEditing = async () => {
    if (editingTaskId === null || !editingContent.trim()) return;
    try {
        await fetch(`http://localhost:4000/api/tasks/${editingTaskId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editingContent.trim() }),
        });
        // Actualizar localmente el contenido editado en la lista de tareas
        setTasks((prevTasks) =>
        prevTasks.map((task) =>
            task.id === editingTaskId ? { ...task, content: editingContent.trim() } : task
        )
        );
        cancelEditing();
    } catch {
        setError("Error actualizando tarea");
    }
    };


  const deleteCompletedTasks = async () => {
    if (!window.confirm("¿Seguro que querés eliminar todas las tareas completadas?")) return;
    try {
      await fetch(`http://localhost:4000/api/tasks/completed?boardId=${boardId}`, {
        method: "DELETE",
        credentials: "include",
      });
      fetchTasks();
    } catch {
      setError("Error eliminando tareas completadas");
    }
  };

  return (
    <div>
      <h3>Tareas</h3>

      {/* Filtros y búsqueda */}
      <div style={{ marginBottom: 10 }}>
        <input
          type="text"
          placeholder="Buscar tareas"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <select
          value={filter}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setFilter(e.target.value as "all" | "completed" | "pending")
          }
        >
          <option value="all">Todas</option>
          <option value="completed">Completadas</option>
          <option value="pending">Pendientes</option>
        </select>
      </div>

      {/* Loader y errores */}
      {loading && <p>Cargando tareas...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Lista */}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleComplete(task)}
            />
            {editingTaskId === task.id ? (
              <>
                <input
                  type="text"
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                />
                <button onClick={saveEditing}>Guardar</button>
                <button onClick={cancelEditing}>Cancelar</button>
              </>
            ) : (
              <>
                <span
                  style={{
                    textDecoration: task.completed ? "line-through" : "none",
                    marginLeft: 8,
                    marginRight: 8,
                  }}
                >
                  {task.content}
                </span>
                <button onClick={() => startEditing(task)}>Editar</button>
                <button onClick={() => deleteTask(task.id)}>Eliminar</button>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* Paginación */}
      <div style={{ marginTop: 10 }}>
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Anterior
        </button>
        <span style={{ margin: "0 10px" }}>
          Página {page} de {totalPages}
        </span>
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
          Siguiente
        </button>
      </div>

      {/* Botón eliminar completadas */}
      <button style={{ marginTop: 10 }} onClick={deleteCompletedTasks}>
        Eliminar tareas completadas
      </button>
    </div>
  );
};
