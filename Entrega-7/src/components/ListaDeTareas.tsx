import React, { useEffect } from "react";
import { useTareas } from "../hooks/useTareas";
import { useFiltroStore } from "../store/filtroStore";
import { useToastStore } from "../store/toastStore";
import TareaItem from "./TareaItem";
import { Tarea } from "../types";

const ListaDeTareas: React.FC = () => {
  const { data: tareas = [], isLoading, isError, error } = useTareas();
  const { filtro } = useFiltroStore();
  const agregarToast = useToastStore((s) => s.agregarToast);

  useEffect(() => {
    if (isError) {
      agregarToast("Error al cargar tareas", "error");
    }
  }, [isError, agregarToast]);

  const tareasFiltradas = tareas.filter((t: Tarea) => {
    if (filtro === "completadas") return t.completada;
    if (filtro === "incompletas") return !t.completada;
    return true;
  });

  if (isLoading) return <p className="text-gray-500">Cargando tareas...</p>;
  if (isError) return <p className="text-red-500">No se pudieron cargar las tareas.</p>;
  if (tareasFiltradas.length === 0) return <p className="text-gray-500">No hay tareas para mostrar.</p>;

  return (
    <ul className="w-full max-w-md space-y-2">
      {tareasFiltradas.map((t) => (
        <TareaItem key={t.id} tarea={t} />
      ))}
    </ul>
  );
};

export default ListaDeTareas;
