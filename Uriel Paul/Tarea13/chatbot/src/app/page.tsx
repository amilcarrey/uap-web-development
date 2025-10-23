"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";

export default function Page() {
  // v5: sin opciones 'api'; usa el endpoint por defecto (/api/chat)
  const { messages, sendMessage, status, error } = useChat();
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = input.trim();
    if (!value) return;
    setPending(true);
    try {
      // v5: enviar como parts (no 'content' string)
      await sendMessage({
        role: "user",
        parts: [{ type: "text", text: value }],
      });
      setInput("");
    } finally {
      setPending(false);
    }
  };

  // Renderizar texto desde parts
  const renderText = (m: any) =>
    (m?.parts ?? [])
      .filter((p: any) => p?.type === "text")
      .map((p: any) => (p?.text ?? "").toString())
      .join("");

  const isStreaming = status === "streaming";

  return (
    <main className="mx-auto max-w-2xl p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Chatbot</h1>

      <div className="border rounded-lg p-3 h-[60vh] overflow-y-auto space-y-3 bg-white">
        {messages.map((m: any) => (
          <div
            key={m.id}
            className={`whitespace-pre-wrap ${
              m.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <span className="inline-block rounded-xl px-3 py-2 border break-words">
              {renderText(m)}
            </span>
          </div>
        ))}

        {(isStreaming || pending) && (
          <div className="text-sm opacity-60">Escribiendo…</div>
        )}
        {error && <div className="text-sm text-red-600">Error de API</div>}
      </div>

      <form className="flex gap-2" onSubmit={onSubmit}>
        <input
          name="prompt"
          className="flex-1 border rounded-lg px-3 py-2"
          placeholder="Escribe tu mensaje…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={2000}
        />
        <button
          type="submit"
          disabled={isStreaming || pending}
          className="border rounded-lg px-4 py-2"
        >
          Enviar
        </button>
      </form>
    </main>
  );
}
