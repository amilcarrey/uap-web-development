import { NextRequest, NextResponse } from 'next/server';
import { leerTableros, crearTablero, eliminarTablero } from '@/lib/tableros';
import { leerTableroPorId } from '@/lib/tableros';
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const tablero = leerTableroPorId(params.id);

  if (!tablero) {
    return NextResponse.json({ error: 'Tablero no encontrado' }, { status: 404 });
  }

  return NextResponse.json(tablero);
}

export async function POST(req: NextRequest) {
  const { accion, nombre, id } = await req.json();

  if (accion === 'crear' && nombre) {
    const nuevo = crearTablero(nombre);
    return NextResponse.json(nuevo);
  }

  if (accion === 'eliminar' && id) {
    eliminarTablero(id);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
}
