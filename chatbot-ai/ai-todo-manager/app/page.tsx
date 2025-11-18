"use client";

import { useEffect, useMemo, useRef, useState } from "react";

function uid() {
  return Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 9);
}

type Role = "user" | "assistant" | "system";
type Message = { id: string; role: Role; content: string; createdAt: string };

type Task = {
  id: string;
  title: string;
  priority: "low" | "medium" | "high";
  category: "work" | "personal" | "shopping" | "health" | "other";
  dueDate?: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};

const STORAGE_KEYS = { TASKS: "ai_todo_tasks_v1", CONVO: "ai_todo_convo_v1" };

function useLocalStorageState<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);

  return [state, setState] as const;
}

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [messages, setMessages] = useLocalStorageState<Message[]>(STORAGE_KEYS.CONVO, [
    { id: "assistant-welcome", role: "assistant", content: "Hola — soy tu asistente de tareas. ¿En qué puedo ayudarte?", createdAt: new Date().toISOString() },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<{ q?: string; priority?: string; completed?: string }>({});
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Stats
  const stats = useMemo(() => {
    const total = tasks.filter((t) => !t.deletedAt).length;
    const completed = tasks.filter((t) => t.completed && !t.deletedAt).length;
    const pending = total - completed;
    const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);
    const overdue = tasks.filter((t) => !t.deletedAt && !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length;
    const byPriority = { high: 0, medium: 0, low: 0 };
    for (const t of tasks) if (!t.deletedAt) byPriority[t.priority]++;
    return { total, completed, pending, completionRate, overdue, byPriority };
  }, [tasks]);

  // CRUD helpers (local)
  // Load tasks from the REST API
  async function loadTasks() {
    try {
      const res = await fetch("/api/tasks");
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const json = await res.json();
      setTasks(Array.isArray(json.tasks) ? (json.tasks as Task[]) : []);
    } catch (err) {
      console.error("loadTasks error", err);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  // CRUD helpers (via REST)
  async function addTask(values: Partial<Task>) {
    try {
      const res = await fetch("/api/tasks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      if (!res.ok) throw new Error("Failed to create task");
      await loadTasks();
    } catch (err) {
      console.error(err);
    }
  }

  async function updateTask(id: string, patch: Partial<Task>) {
    try {
      const res = await fetch(`/api/tasks?id=${encodeURIComponent(id)}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) });
      if (!res.ok) throw new Error("Failed to update task");
      await loadTasks();
    } catch (err) {
      console.error(err);
    }
  }

  async function softDeleteTask(id: string) {
    try {
      const res = await fetch(`/api/tasks?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete task");
      await loadTasks();
    } catch (err) {
      console.error(err);
    }
  }

  // Send message to backend LLM (which has tools)
  async function sendMessage(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = { id: uid(), role: "user", content: text.trim(), createdAt: new Date().toISOString() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: [...messages, userMsg] }) });
      const data = (await res.json()) as unknown;

      // Normalize data as object for safe property access
      const dataObj = data && typeof data === "object" && data !== null ? (data as Record<string, unknown>) : null;

      // Try to extract assistant text heuristically
      let assistantText = "";
      if (dataObj && "output" in dataObj && typeof dataObj.output === "object" && dataObj.output !== null) {
        const out = dataObj.output as Record<string, unknown>;
        if ("text" in out) assistantText = String(out.text ?? "");
      } else if (typeof data === "string") {
        assistantText = data;
      } else {
        assistantText = JSON.stringify(data, null, 2);
      }

      const assistantMsg: Message = { id: uid(), role: "assistant", content: assistantText, createdAt: new Date().toISOString() };
      setMessages((m) => [...m, assistantMsg]);

      // If backend returned tool results, detect task-like objects and add to local tasks
      function isTaskLike(obj: unknown): obj is Partial<Task> {
        return typeof obj === "object" && obj !== null && "title" in obj;
      }

      if (dataObj && "tool_results" in dataObj && typeof dataObj.tool_results === "object" && dataObj.tool_results !== null) {
        const toolResults = dataObj.tool_results as Record<string, unknown>;
        for (const key of Object.keys(toolResults)) {
          const val = toolResults[key];
          if (isTaskLike(val)) {
            const obj = val as Record<string, unknown>;
            const title = String(obj.title ?? "");
            if (!title) continue;
            const priority = (obj.priority ?? "medium") as Task["priority"];
            const category = (obj.category ?? "other") as Task["category"];
            const dueDate = typeof obj.dueDate === "string" ? obj.dueDate : null;
            addTask({ title, priority, category, dueDate });
          }
        }
      }
    } catch (err) {
      console.error(err);
      const errMsg: Message = { id: uid(), role: "assistant", content: "Error: no se pudo conectar con el servidor.", createdAt: new Date().toISOString() };
      setMessages((m) => [...m, errMsg]);
    } finally {
      setLoading(false);
    }
  }

  // Local quick add form
  const [quickTitle, setQuickTitle] = useState("");
  function handleQuickAdd(e?: React.FormEvent) {
    e?.preventDefault();
    if (!quickTitle.trim()) return;
    addTask({ title: quickTitle.trim() });
    setQuickTitle("");
  }

  // Filters
  const visibleTasks = tasks.filter((t) => !t.deletedAt).filter((t) => {
    if (filter.q && !t.title.toLowerCase().includes(filter.q.toLowerCase())) return false;
    if (filter.priority && filter.priority !== "") return t.priority === filter.priority;
    if (filter.completed === "true") return t.completed === true;
    if (filter.completed === "false") return t.completed === false;
    return true;
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 p-6">
      <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 bg-white dark:bg-zinc-800 rounded-lg shadow p-4 flex flex-col">
          <header className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">Chat Conversacional (AI)</h2>
            <div className="text-sm text-zinc-500">Herramientas disponibles: crear/actualizar/eliminar/buscar/stats</div>
          </header>

          <div className="flex-1 overflow-auto border rounded p-3 bg-zinc-50 dark:bg-zinc-900">
            <div className="space-y-3">
              {messages.map((m) => (
                <div key={m.id} className={`p-3 rounded ${m.role === "user" ? "bg-white text-right" : "bg-zinc-100 dark:bg-zinc-700 text-left"}`}>
                  <div className="text-sm text-zinc-500">{m.role}</div>
                  <div className="whitespace-pre-wrap mt-1">{m.content}</div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <form
            className="mt-3 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="flex-1 rounded px-3 py-2 border bg-white dark:bg-zinc-800"
            />
            <button className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50" disabled={loading}>
              {loading ? "Enviando..." : "Enviar"}
            </button>
          </form>
        </section>

        <aside className="bg-white dark:bg-zinc-800 rounded-lg shadow p-4 flex flex-col gap-4">
          <div>
            <h3 className="font-semibold">Tareas</h3>
            <form className="flex gap-2 mt-2" onSubmit={handleQuickAdd}>
              <input value={quickTitle} onChange={(e) => setQuickTitle(e.target.value)} placeholder="Agregar tarea rápidamente" className="flex-1 rounded px-2 py-1 border bg-white dark:bg-zinc-800" />
              <button className="px-3 py-1 bg-green-600 text-white rounded">Agregar</button>
            </form>
          </div>

          <div className="flex gap-2 items-center">
            <input placeholder="Buscar" className="flex-1 rounded px-2 py-1 border bg-white dark:bg-zinc-800" onChange={(e) => setFilter((f) => ({ ...f, q: e.target.value }))} />
            <select onChange={(e) => setFilter((f) => ({ ...f, priority: e.target.value }))} className="rounded px-2 py-1 border bg-white dark:bg-zinc-800">
              <option value="">Todas</option>
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
            </select>
          </div>

          <div className="flex-1 overflow-auto">
            {visibleTasks.length === 0 ? (
              <div className="text-sm text-zinc-500">No hay tareas.</div>
            ) : (
              <ul className="space-y-2">
                {visibleTasks.map((t) => (
                  <li key={t.id} className="p-2 border rounded flex items-center justify-between bg-white dark:bg-zinc-900">
                    <div>
                      <div className="font-medium">{t.title}</div>
                      <div className="text-xs text-zinc-500">{t.category} • {t.priority} {t.dueDate ? `• vence ${new Date(t.dueDate).toLocaleDateString()}` : ''}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateTask(t.id, { completed: !t.completed })} className={`px-2 py-1 rounded ${t.completed ? 'bg-green-600 text-white' : 'bg-zinc-100 dark:bg-zinc-700'}`}>
                        {t.completed ? '✓' : 'Marcar'}
                      </button>
                      <button onClick={() => softDeleteTask(t.id)} className="px-2 py-1 rounded bg-red-600 text-white">Borrar</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="pt-2 border-t">
            <h4 className="text-sm font-semibold">Estadísticas</h4>
            <div className="text-sm text-zinc-600">Total: {stats.total}</div>
            <div className="text-sm text-zinc-600">Completadas: {stats.completed}</div>
            <div className="text-sm text-zinc-600">Pendientes: {stats.pending}</div>
            <div className="text-sm text-zinc-600">Tasa: {stats.completionRate}%</div>
            <div className="text-sm text-zinc-600">Atrasadas: {stats.overdue}</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
