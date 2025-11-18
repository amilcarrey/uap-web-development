import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET → todas las tareas
export async function GET() {
  const tasks = await prisma.task.findMany({
    where: { deleted: false },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(tasks);
}

// POST → crear tarea
export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.title || data.title.trim() === "") {
      return NextResponse.json(
        { error: "El título es obligatorio." },
        { status: 400 }
      );
    }

    const newTask = await prisma.task.create({
      data: {
        title: data.title,
        priority: data.priority ?? "medium",
        category: data.category ?? "other",
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      },
    });

    return NextResponse.json(newTask);
  } catch (err) {
    return NextResponse.json(
      { error: "Error creando tarea", detail: String(err) },
      { status: 500 }
    );
  }
}
