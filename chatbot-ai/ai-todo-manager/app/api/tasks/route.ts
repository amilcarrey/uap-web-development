import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/tasks => list tasks (query params: q, priority, completed)
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const q = url.searchParams.get("q") ?? undefined;
    const priority = url.searchParams.get("priority") ?? undefined;
    const completed = url.searchParams.get("completed");

    const where: Record<string, unknown> = { deletedAt: null };
    if (q) (where as Record<string, unknown>).title = { contains: q, mode: "insensitive" };
    if (priority) (where as Record<string, unknown>).priority = priority;
    if (completed === "true") where.completed = true;
    if (completed === "false") where.completed = false;

    const tasks = await prisma.task.findMany({ where, orderBy: { createdAt: "desc" } });
    return NextResponse.json({ tasks });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to list tasks" }, { status: 500 });
  }
}

// POST /api/tasks => create a task
export async function POST(request: Request) {
  try {
    type CreateTaskBody = { title?: unknown; priority?: unknown; category?: unknown; dueDate?: unknown };
    const body = (await request.json()) as CreateTaskBody;
    const title = (body.title ?? "").toString().trim();
    if (!title) return NextResponse.json({ error: "title is required" }, { status: 400 });

    const allowedPriorities = ["low", "medium", "high"] as const;
    type Priority = (typeof allowedPriorities)[number];
    const allowedCategories = ["work", "personal", "shopping", "health", "other"] as const;
    type Category = (typeof allowedCategories)[number];

    const priority = allowedPriorities.includes((body.priority as Priority) ?? "medium") ? ((body.priority as Priority) ?? "medium") : "medium";
    const category = allowedCategories.includes((body.category as Category) ?? "other") ? ((body.category as Category) ?? "other") : "other";
    const dueDate = typeof body.dueDate === "string" ? new Date(body.dueDate) : null;

    const created = await prisma.task.create({
      data: {
        title,
        priority,
        category,
        dueDate: dueDate ?? undefined,
      },
    });

    return NextResponse.json({ task: created }, { status: 201 });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}

// PUT /api/tasks?id=... => update task fields
export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    type UpdateTaskBody = { title?: unknown; priority?: unknown; category?: unknown; dueDate?: unknown; completed?: unknown };
    const body = (await request.json()) as UpdateTaskBody;

    const patch: {
      title?: string;
      priority?: "low" | "medium" | "high";
      category?: "work" | "personal" | "shopping" | "health" | "other";
      dueDate?: Date | null;
      completed?: boolean;
    } = {};

    if (typeof body.title === "string") patch.title = body.title.trim();
    if (typeof body.priority === "string") patch.priority = body.priority as typeof patch.priority;
    if (typeof body.category === "string") patch.category = body.category as typeof patch.category;
    if (body.dueDate === null) patch.dueDate = null;
    else if (typeof body.dueDate === "string") patch.dueDate = new Date(body.dueDate);
    if (typeof body.completed === "boolean") patch.completed = body.completed;

    const updated = await prisma.task.update({ where: { id }, data: patch });
    return NextResponse.json({ task: updated });
  } catch (err: unknown) {
    console.error(err);
    const msg = err instanceof Error ? err.message : "Failed to update";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// DELETE /api/tasks?id=... => soft delete (set deletedAt)
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    const deleted = await prisma.task.update({ where: { id }, data: { deletedAt: new Date() } });
    return NextResponse.json({ task: deleted });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

// Extra: GET /api/tasks/stats to fetch summary
export async function GET_stats() {
  // Not used by Next routing automatically — route.ts supports GET only once.
}
