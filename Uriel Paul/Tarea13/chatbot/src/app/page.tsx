"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";

type MessageRole = "user" | "assistant" | "system";

const roleLabels: Record<MessageRole, string> = {
  user: "Tú",
  assistant: "Asistente",
  system: "Sistema",
};

export default function ChatPage() {
  const { messages, sendMessage, status, error } = useChat({
    id: "ejercicio-13-chatbot",
  });

  const listRef = useRef<HTMLDivElement | null>(null);
  const [input, setInput] = useState("");

  const sendUserMessage = async (text: string) => {
    const value = text.trim();
    if (!value) return;
    try {
      await sendMessage({ text: value });
    } catch (err) {
      console.error("No fue posible enviar el mensaje:", err);
    }
  };

  // Keep the scroll anchored to the last message while streaming.
  useEffect(() => {
    const node = listRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [messages, status]);

  const chatHistory = useMemo(
    () =>
      messages
        .filter((message) => message.role !== "system")
        .map((message) => {
          const text =
            message.parts
              ?.map((part) => {
                if (part.type !== "text") {
                  return "";
                }
                return part.text ?? "";
              })
              .join("")
              .trim() ?? "";

          return {
            id: message.id,
            role: (message.role as MessageRole) ?? "assistant",
            text,
          };
        })
        .filter((message) => message.text.length > 0),
    [messages],
  );

  const isAwaitingResponse =
    status === "submitted" || status === "streaming";

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = input.trim();
    if (!value) return;
    await sendUserMessage(value);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header
        role="banner"
        className="sticky top-0 inset-x-0 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur"
      >
        <div className="mx-auto max-w-3xl px-3 py-4 sm:px-4">
          <h1 className="text-lg font-semibold tracking-tight text-zinc-100">
            chatbot
          </h1>
        </div>
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-64px)] max-w-3xl flex-col px-3 pb-24 pt-6 sm:px-4">
        <div className="flex flex-1 flex-col rounded-3xl border border-zinc-800 bg-zinc-900/80 shadow-lg shadow-black/10">
          <div
            ref={listRef}
            className="h-[calc(100vh-200px)] space-y-3 overflow-y-auto pl-4 pr-1 pb-6 pt-5"
            aria-live="polite"
          >
            {chatHistory.length === 0 ? (
              <EmptyState onExample={(question) => void sendUserMessage(question)} />
            ) : (
              chatHistory.map((message) => (
                <ChatMessage key={message.id} role={message.role} text={message.text} />
              ))
            )}

            {isAwaitingResponse ? <TypingIndicator /> : null}

            {error ? (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error instanceof Error
                  ? error.message
                  : "Ocurrió un error al conectar con el modelo."}
              </div>
            ) : null}
          </div>

          <form
            className="sticky bottom-0 inset-x-0 rounded-b-3xl border-t border-zinc-800 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/60"
            onSubmit={onSubmit}
          >
            <div className="p-3">
              <label htmlFor="prompt" className="sr-only">
                Escribe tu mensaje
              </label>
              <div className="flex items-center gap-2">
                <textarea
                  id="prompt"
                  name="prompt"
                  rows={2}
                  required
                  maxLength={2000}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 shadow-inner outline-none transition duration-150 placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-600"
                  placeholder="Haz una pregunta al asistente…"
                  aria-label="Mensaje para el asistente"
                />
                <button
                  type="submit"
                  disabled={isAwaitingResponse || input.trim().length === 0}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-600 hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Enviar
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>

      <style jsx global>{`
        *::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        *::-webkit-scrollbar-thumb {
          background: rgb(39 39 42 / 0.8);
          border-radius: 9999px;
        }
        *::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}

function ChatMessage({ role, text }: { role: MessageRole; text: string }) {
  const isUser = role === "user";
  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
      role="group"
      aria-label={`${roleLabels[role]} dice`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 leading-relaxed transition duration-150 ${
          isUser
            ? "bg-indigo-600 text-white"
            : "border border-zinc-800 bg-zinc-900 text-zinc-100"
        }`}
      >
        <p className="whitespace-pre-line break-words">{text}</p>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="text-sm text-zinc-400">Escribiendo…</div>
  );
}

function EmptyState({
  onExample,
}: {
  onExample: (question: string) => void;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/60 p-6 text-sm text-zinc-400">
      <p className="font-medium text-zinc-200">
        Tu conversación aparecerá aquí. Algunas ideas para empezar:
      </p>
      <ul className="mt-3 grid gap-2 md:grid-cols-2">
        {[
          "Explícame qué es el APIs y cómo funcionan.",
          "Sugiere un plan de estudio de JavaScript para 4 semanas.",
          "Resume la diferencia entre SSR y SSG en Next.js.",
          "Dame consejos para mejorar la accesibilidad de un formulario.",
        ].map((suggestion) => (
          <li key={suggestion}>
            <button
              type="button"
              onClick={() => onExample(suggestion)}
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-left text-zinc-200 transition duration-150 hover:border-indigo-600 hover:bg-indigo-600/20 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              {suggestion}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
