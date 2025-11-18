import { NextResponse } from "next/server";
import { tool, generateText } from "ai";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Zod schemas & TS types for each tool
const CreateTaskSchema = z.object({
  title: z.string().min(1),
  priority: z.enum(["low", "medium", "high"]).optional(),
  category: z.enum(["work", "personal", "shopping", "health", "other"]).optional(),
  dueDate: z.string().optional(),
  userId: z.string().optional(),
});
type CreateTaskArgs = z.infer<typeof CreateTaskSchema>;

const UpdateTaskSchema = z.object({
  taskId: z.string(),
  title: z.string().optional(),
  completed: z.boolean().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  dueDate: z.string().optional(),
  category: z.enum(["work", "personal", "shopping", "health", "other"]).optional(),
});
type UpdateTaskArgs = z.infer<typeof UpdateTaskSchema>;

const DeleteTaskSchema = z.object({ taskId: z.string(), confirm: z.boolean().optional() });
type DeleteTaskArgs = z.infer<typeof DeleteTaskSchema>;

const SearchTasksSchema = z.object({
  query: z.string().optional(),
  completed: z.boolean().nullable().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  category: z.enum(["work", "personal", "shopping", "health", "other"]).optional(),
  dueDateFrom: z.string().optional(),
  dueDateTo: z.string().optional(),
  sortBy: z.enum(["createdAt", "dueDate", "priority", "title"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  limit: z.number().int().positive().optional(),
});
type SearchTasksArgs = z.infer<typeof SearchTasksSchema>;

const GetStatsSchema = z.object({ period: z.enum(["today", "week", "month", "year", "all-time"]).optional(), groupBy: z.enum(["category", "priority", "date"]).optional() });
type GetStatsArgs = z.infer<typeof GetStatsSchema>;

function parseISODate(input?: string | null) {
  if (!input) return null;
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

function ensureFutureDate(date?: string | null) {
  if (!date) return true;
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return false;
  return d.getTime() > Date.now();
}

// Helper to convert zod-validated args safely
function validate<T extends z.ZodTypeAny>(schema: T, value: unknown) {
  return schema.parse(value) as z.infer<T>;
}

// --- Tools (cast to any when calling SDK to avoid typing mismatch) ---
/* eslint-disable @typescript-eslint/no-explicit-any */
const createTask = (tool as any)({
  description: "Crea una nueva tarea",
  inputSchema: CreateTaskSchema,
  async execute(rawArgs: unknown) {
    const args = validate(CreateTaskSchema, rawArgs) as CreateTaskArgs;
    const { title, priority, category, dueDate, userId } = args;

    if (dueDate && !ensureFutureDate(dueDate)) {
      throw new Error("La fecha límite debe ser futura.");
    }

    const created = await prisma.task.create({
      data: {
        title: title.trim(),
        priority: priority ?? "medium",
        category: category ?? "other",
        dueDate: parseISODate(dueDate),
        userId: userId ?? null,
      },
    });

    return created;
  },
});

const updateTask = (tool as any)({
  description: "Actualiza una tarea existente",
  inputSchema: UpdateTaskSchema,
  async execute(rawArgs: unknown) {
    const args = validate(UpdateTaskSchema, rawArgs) as UpdateTaskArgs;
    const { taskId, title, completed, priority, dueDate, category } = args;

    const existing = await prisma.task.findUnique({ where: { id: taskId } });
    if (!existing || existing.deletedAt) throw new Error("La tarea no existe.");

    if (!title && completed === undefined && !priority && !dueDate && !category) {
      throw new Error("Se requiere al menos un campo para actualizar.");
    }

    if (dueDate && !ensureFutureDate(dueDate)) throw new Error("La nueva fecha límite debe ser futura.");

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: {
        title: title ? title.trim() : undefined,
        completed: completed === undefined ? undefined : completed,
        priority: priority ?? undefined,
        dueDate: dueDate ? parseISODate(dueDate) : undefined,
        category: category ?? undefined,
      },
    });

    return updated;
  },
});

const deleteTask = (tool as any)({
  description: "Elimina (soft-delete) una tarea",
  inputSchema: DeleteTaskSchema,
  async execute(rawArgs: unknown) {
    const args = validate(DeleteTaskSchema, rawArgs) as DeleteTaskArgs;
    const { taskId, confirm = false } = args;

    const existing = await prisma.task.findUnique({ where: { id: taskId } });
    if (!existing || existing.deletedAt) throw new Error("La tarea no existe o ya fue eliminada.");

    if (!confirm) {
      // Require explicit confirmation for delete operations
      return { requireConfirmation: true, message: `Se eliminará '${existing.title}'. Confirma con { confirm: true }` };
    }

    const deleted = await prisma.task.update({ where: { id: taskId }, data: { deletedAt: new Date() } });
    return { success: true, deletedId: deleted.id, deletedTitle: deleted.title };
  },
});

const searchTasks = (tool as any)({
  description: "Buscar y filtrar tareas",
  inputSchema: SearchTasksSchema,
  async execute(rawArgs: unknown) {
    const args = validate(SearchTasksSchema, rawArgs) as SearchTasksArgs;
    const { query, completed, priority, category, dueDateFrom, dueDateTo, sortBy, sortOrder, limit } = args;

    const where: Record<string, unknown> = { deletedAt: null };
    if (query) where.title = { contains: query, mode: "insensitive" };
    if (completed !== undefined && completed !== null) where.completed = completed;
    if (priority) where.priority = priority;
    if (category) where.category = category;
    if (dueDateFrom || dueDateTo) {
      const range: Record<string, unknown> = {};
      if (dueDateFrom) {
        const d = parseISODate(dueDateFrom);
        if (d) range.gte = d;
      }
      if (dueDateTo) {
        const d = parseISODate(dueDateTo);
        if (d) range.lte = d;
      }
      where.dueDate = range;
    }

    const orderBy = sortBy ? { [sortBy]: sortOrder ?? "asc" } : { createdAt: "desc" };

    const tasks = await prisma.task.findMany({ where: where as any, orderBy: orderBy as any, take: limit ?? 50 });
    const total = await prisma.task.count({ where: where as any });

    return { tasks, total, hasMore: (limit ? total > limit : total > 50) };
  },
});

const getTaskStats = (tool as any)({
  description: "Genera estadísticas de productividad",
  inputSchema: GetStatsSchema,
  async execute(rawArgs: unknown) {
    const args = validate(GetStatsSchema, rawArgs) as GetStatsArgs;
    const { period } = args;

    const now = new Date();
    let since: Date | null = null;
    if (period === "today") since = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    else if (period === "week") {
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      since = new Date(now.getFullYear(), now.getMonth(), diff);
    } else if (period === "month") since = new Date(now.getFullYear(), now.getMonth(), 1);
    else if (period === "year") since = new Date(now.getFullYear(), 0, 1);

    const baseWhere: Record<string, unknown> = { deletedAt: null };
    const sinceWhere = since ? { createdAt: { gte: since } } : undefined;

    const totalTasks = await prisma.task.count({ where: baseWhere as any });
    const completedTasks = await prisma.task.count({ where: { ...baseWhere, completed: true } as any });
    const pendingTasks = await prisma.task.count({ where: { ...baseWhere, completed: false } as any });
    const overdueTasks = await prisma.task.count({ where: { ...baseWhere, completed: false, dueDate: { lt: new Date() } } as any });

    // by priority
    const byPriorityRaw = await prisma.task.groupBy({ by: ["priority"], where: baseWhere as any, _count: { _all: true } }).catch(() => []);
    const byPriority: Record<string, { total: number; completed: number; pending: number }> = { high: { total: 0, completed: 0, pending: 0 }, medium: { total: 0, completed: 0, pending: 0 }, low: { total: 0, completed: 0, pending: 0 } };
    for (const row of byPriorityRaw as any[]) {
      const p = row.priority as string;
      const total = row._count._all as number;
      const completed = await prisma.task.count({ where: { ...baseWhere, priority: p, completed: true } as any });
      const pending = await prisma.task.count({ where: { ...baseWhere, priority: p, completed: false } as any });
      byPriority[p] = { total, completed, pending };
    }

    // by category
    const categories = ["work", "personal", "shopping", "health", "other"];
    const byCategory: Record<string, { total: number; completed: number; pending: number }> = {};
    for (const c of categories) {
      const total = await prisma.task.count({ where: { ...baseWhere, category: c } as any });
      const completed = await prisma.task.count({ where: { ...baseWhere, category: c, completed: true } as any });
      const pending = await prisma.task.count({ where: { ...baseWhere, category: c, completed: false } as any });
      byCategory[c] = { total, completed, pending };
    }

    const tasksCreatedToday = await prisma.task.count({ where: { ...baseWhere, createdAt: { gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()) } } as any });
    const tasksCompletedToday = await prisma.task.count({ where: { ...baseWhere, completed: true, updatedAt: { gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()) } } as any });

    const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    const nextDue = await prisma.task.findFirst({ where: { ...baseWhere, dueDate: { gte: new Date() } } as any, orderBy: { dueDate: "asc" } as any });

    const upcoming = {
      dueTodayCount: await prisma.task.count({ where: { ...baseWhere, dueDate: { gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()), lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) } } as any }),
      dueThisWeekCount: 0,
      nextDueTask: nextDue ?? null,
    };

    const periodCounts = sinceWhere ? {
      periodTotal: await prisma.task.count({ where: { ...baseWhere, ...sinceWhere } as any }),
      periodCompleted: await prisma.task.count({ where: { ...baseWhere, ...sinceWhere, completed: true } as any }),
    } : undefined;

    return {
      summary: { totalTasks, completedTasks, pendingTasks, completionRate, overdueTasks },
      byPriority,
      byCategory,
      timeline: { tasksCreatedToday, tasksCompletedToday },
      productivity: { averageCompletionTime: null, mostProductiveDay: null, currentStreak: 0, longestStreak: 0 },
      upcoming,
      periodCounts,
    };
  },
});

/* eslint-enable @typescript-eslint/no-explicit-any */

export async function POST(req: Request) {
  const { messages } = await req.json();

  // cast model to any because SDK typings expect a specific model union type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await generateText({ model: process.env.OPENROUTER_MODEL as any, messages, tools: { createTask, updateTask, deleteTask, searchTasks, getTaskStats } as any });

  return NextResponse.json(result);
}
