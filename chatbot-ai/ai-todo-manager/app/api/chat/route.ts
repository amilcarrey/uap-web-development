import { NextResponse } from "next/server";
import { tool, generateText } from "ai";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// TOOL — AI SDK v3
const createTask = tool({
  description: "Crea una nueva tarea",
  inputSchema: z.object({
    title: z.string(),
    priority: z.enum(["low", "medium", "high"]).optional(),
    category: z.string().optional(),
    dueDate: z.string().optional(),
  }),
  async execute(args) {
    const { title, priority, category, dueDate } = args;

    return prisma.task.create({
      data: {
        title,
        priority: priority ?? "medium",
        category: category ?? "other",
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });
  },
});

// ROUTE HANDLER — AI SDK v3
export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await generateText({
    model: process.env.OPENROUTER_MODEL!, // <—— STRING SÍ ES VÁLIDO EN v3
    messages,
    tools: { createTask },
  });

  return NextResponse.json(result);
}
