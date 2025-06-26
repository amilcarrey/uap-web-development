import React, { useEffect } from "react";
import { useTareas } from "../hooks/useTareas";
import { useTareasStore } from "../store/TareasStore";
import { NuevaTareaForm } from "./TareaNueva";
import { TareaItem } from "./TareaItem";
import type { Tarea } from "../types/tarea";

interface Props {
  tableroId: string;
}

export const ListaTareas = ({ tableroId }: Props) => {
  const page = useTareasStore((s) => s.page);
  const setPage = useTareasStore((s) => s.setPage);
  const search = useTareasStore((s) => s.search);
  const { editing, cancelEditing, setEditingContent } = useTareasStore();

  const { tareas, status, addTarea, updateTarea, deleteTarea } = useTareas(tableroId, page, search);

  useEffect(() => {
    console.log("Tablero cambiado:", tableroId);
    setPage(1);
    cancelEditing();
  }, [tableroId, setPage, cancelEditing]);

  const isEditing = editing.id !== null;

  const handleSave = (content: string) => {
    if (isEditing) {
      const tareaEditando = tareas?.find((t: Tarea) => t.id === editing.id);
      if (!tareaEditando) {
        console.error("No se encontró la tarea que se quiere editar");
        return;
      }
      console.log("Editando tarea:", tareaEditando);
      updateTarea.mutate({
        ...tareaEditando,
        content,
      });
      cancelEditing();
    } else {
      console.log("Agregando tarea con contenido:", content);
      addTarea.mutate({ content, tableroId });
    }
  };

  if (status === "pending") return <div>Cargando tareas...</div>;
  if (status === "error") return <div>Error cargando tareas</div>;

  const tareasFiltradas = tareas?.filter((t: { content: string; }) =>
    search.trim() === "" ? true : t.content.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  console.log("Tareas filtradas para mostrar:", tareasFiltradas);

  return (
    <div className="to-do">
      <NuevaTareaForm
        onSave={handleSave}
        editingContent={editing.content}
        setEditingContent={setEditingContent}
        isEditing={isEditing}
        onCancel={cancelEditing}
      />
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {tareasFiltradas.length === 0 ? (
          <li>No hay tareas para mostrar.</li>
        ) : (
          tareasFiltradas.map((t: Tarea) => (
            <TareaItem
              key={t.id}
              tarea={t}
              onUpdate={updateTarea.mutate}
              onDelete={deleteTarea.mutate}
            />
          ))
        )}
      </ul>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Anterior
        </button>
        <button onClick={() => setPage(page + 1)}>Siguiente</button>
      </div>
    </div>
  );
};
