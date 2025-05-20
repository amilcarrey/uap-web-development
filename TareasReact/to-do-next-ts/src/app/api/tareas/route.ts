import { NextRequest, NextResponse } from 'next/server';
import {
  getTareas,
  agregarTarea,
  borrarTarea,
  toggleTarea,
  limpiarCompletadas,
} from '@/lib/tareas';

export async function GET(req: NextRequest) {
  const filtro = req.nextUrl.searchParams.get('filtro') || 'todas';

  // Consigna 6: Agregar botones de filtro que permitan ver todas las tareas, las incompletas y las completas. Prestar atención que si se aplica un filtro, no se pierdan datos y se pueda volver a un estado anterior.
  const tareas = getTareas().filter((t) =>
    filtro === 'completas'
      ? t.completada
      : filtro === 'incompletas'
      ? !t.completada
      : true
  );

  return NextResponse.json(tareas);
}

export async function POST(req: NextRequest) {
  const { accion, texto, id } = await req.json();

  if (accion === 'agregar' && texto) {
    const tarea = agregarTarea(texto);
    return NextResponse.json({ tarea });
  }

  // Consigna 3: Capacidad de completar y descompletar una tarea al clickear en su correspondiente checkbox.
  if (accion === 'toggle' && id) {
    const tarea = toggleTarea(id);
    return NextResponse.json({ tarea });
  }

  // Consigna 4: Capacidad de eliminar una tarea de la lista.
  if (accion === 'borrar' && id) {
    borrarTarea(id);
    return NextResponse.json({ ok: true });
  }

  // Consigna 5: Eliminar todas las tareas ya completadas al clickear el botón de Clear Completed.
  if (accion === 'limpiar') {
    limpiarCompletadas();
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
}
