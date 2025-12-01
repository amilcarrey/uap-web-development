// app/api/chat/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Mensaje inválido" },
        { status: 400 }
      );
    }

    console.log("ENV:", {
      API_KEY: process.env.OPENROUTER_API_KEY,
      BASE: process.env.OPENROUTER_BASE_URL,
      MODEL: process.env.OPENROUTER_MODEL,
    });

    const response = await fetch(
      `${process.env.OPENROUTER_BASE_URL}/chat/completions`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "Chatbot Next.js",
        },
        body: JSON.stringify({
          model: process.env.OPENROUTER_MODEL || "anthropic/claude-3-haiku",
          messages: [{ role: "user", content: message }],
        }),
      }
    );

    if (!response.ok) {
      const raw = await response.text();
      console.error("OpenRouter ERROR:", response.status, raw);

      return NextResponse.json(
        { error: "Error al comunicarse con OpenRouter", raw },
        { status: 500 }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      reply: data.choices?.[0]?.message?.content ?? "Sin respuesta del modelo",
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
