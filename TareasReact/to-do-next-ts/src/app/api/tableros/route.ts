// src/app/api/tableros/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { leerTableros, crearTablero, eliminarTablero } from '@/lib/tableros';

export async function GET() {
  const tableros = leerTableros();
  return NextResponse.json(tableros);
}

export async function POST(req: NextRequest) {
  const { accion, nombre, id } = await req.json();

  if (accion === 'crear' && nombre) {
    const nuevo = crearTablero(nombre, id); // id es opcional
    return NextResponse.json(nuevo);
  }

  if (accion === 'eliminar' && id) {
    eliminarTablero(id);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
}
