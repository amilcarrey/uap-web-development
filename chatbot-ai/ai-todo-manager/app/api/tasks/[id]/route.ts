import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PUT → actualizar
export async function PUT(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const id = Number(context.params.id);
    const data = await req.json();

    const updated = await prisma.task.update({
      where: { id },
      data: {
        title: data.title,
        completed: data.completed,
        priority: data.priority,
        category: data.category,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json(
      { error: "Error actualizando tarea", detail: String(err) },
      { status: 500 }
    );
  }
}

// DELETE → soft delete
export async function DELETE(
  _: Request,
  context: { params: { id: string } }
) {
  try {
    const id = Number(context.params.id);

    const deleted = await prisma.task.update({
      where: { id },
      data: { deleted: true },
    });

    return NextResponse.json({
      message: "Tarea eliminada",
      task: deleted,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Error eliminando tarea", detail: String(err) },
      { status: 500 }
    );
  }
}
