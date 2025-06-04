import { NextRequest, NextResponse } from 'next/server';
import {
  getTareas,
  agregarTarea,
  borrarTarea,
  toggleTarea,
  limpiarCompletadas,
  editarTarea,
} from '@/lib/tareas';

export async function GET(req: NextRequest) {
  const filtro = req.nextUrl.searchParams.get('filtro') || 'todas';
  const page = parseInt(req.nextUrl.searchParams.get('page') || '1');
  const limit = parseInt(req.nextUrl.searchParams.get('limit') || '5');
  const tableroId = req.nextUrl.searchParams.get('tableroId');

  const todas = getTareas();

  const filtradas = todas.filter((t) =>
    (filtro === 'completas' ? t.completada :
     filtro === 'incompletas' ? !t.completada :
     true) &&
    (!tableroId || t.tableroId === tableroId)
  );

  const total = filtradas.length;
  const inicio = (page - 1) * limit;
  const paginadas = filtradas.slice(inicio, inicio + limit);

  return NextResponse.json({ tareas: paginadas, total });
}


export async function POST(req: NextRequest) {
  const { accion, texto, id, tableroId } = await req.json();

if (accion === 'agregar' && texto && tableroId) {
  const tarea = agregarTarea(texto, tableroId);
  return NextResponse.json({ tarea });
}

if (accion === 'editar' && id && texto) {
  const tarea = editarTarea(id, texto);
  return NextResponse.json({ tarea });
}

if (accion === 'toggle' && id) {
  const tarea = toggleTarea(id);
  return NextResponse.json({ tarea });
}

if (accion === 'borrar' && id) {
  borrarTarea(id);
  return NextResponse.json({ ok: true });
}

if (accion === 'limpiar') {
  limpiarCompletadas();
  return NextResponse.json({ ok: true });
}

  return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
}
