import { NextRequest, NextResponse } from "next/server";
import { streamText } from "ai";
import { client } from "../ai"; // tu archivo ai.ts

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("body", body);

    // Genera texto usando el modelo de OpenRouter
    const response = streamText({
      model: client("minimax/minimax-m2:free"),
      prompt: body.message,
    });

    // Si quieres stream en tiempo real (ideal para un chat)
    // return response.toAIStreamResponse();

    // Si solo quieres el texto completo
    const { text } = response.toTextStreamResponse();
    console.log("response", text);

    return NextResponse.json({ message: text });
  } catch (e: any) {
    console.error("Error en el endpoint:", e);
    return NextResponse.json(
      { error: e.message || "Error interno del servidor" },
      { status: 500 }
    );
  }
}
