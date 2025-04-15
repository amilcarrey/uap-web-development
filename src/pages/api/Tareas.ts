import fs from "fs";
import path from "path";
import { Astro } from "astro";

const filePath = path.resolve("src/data/tareas.json");

type Tarea = {
  id: number;
  descripcion: string;
  completada: boolean;
};

function leerTareas(): Tarea[] {
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

function guardarTareas(tareas: Tarea[]) {
  fs.writeFileSync(filePath, JSON.stringify(tareas, null, 2), "utf-8");
}

export async function get({ request }: Astro.Request) {
  const tareas = leerTareas();
  return new Response(JSON.stringify(tareas), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function post({ request }: Astro.Request) {
  const body = await request.json();
  const tareas = leerTareas();
  const nuevaTarea: Tarea = {
    id: Date.now(),
    descripcion: body.descripcion,
    completada: false,
  };
  tareas.push(nuevaTarea);
  guardarTareas(tareas);
  return new Response(JSON.stringify(nuevaTarea), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function put({ request }: Astro.Request) {
  const body = await request.json();
  const tareas = leerTareas();
  const tareasActualizadas = tareas.map((t) =>
    t.id === body.id ? { ...t, completada: body.completada } : t
  );
  guardarTareas(tareasActualizadas);
  return new Response(null, { status: 204 });
}

export async function del({ request }: Astro.Request) {
  const body = await request.json();
  const tareas = leerTareas();
  const tareasActualizadas = tareas.filter((t) => t.id !== body.id);
  guardarTareas(tareasActualizadas);
  return new Response(null, { status: 204 });
}