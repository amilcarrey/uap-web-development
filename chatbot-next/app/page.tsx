"use client";

import { useState, FormEvent, useRef, useEffect } from "react";
// CAMBIO 1: Importar 'Message' (para texto) y no 'UIMessage'
import { useChat, type Message } from "@ai-sdk/react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

export default function Chat() {
  const { messages, sendMessage, status, error } = useChat(); 
  const isLoading = status === "streaming" || status === "submitted";
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    console.log("Mensajes actuales:", messages); 
  }, [messages, status, error]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    setInput("");
    await sendMessage({ role: "user", content: trimmed });
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col w-full max-w-2xl h-[85vh] bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <header className="bg-indigo-600 text-white text-center py-3 text-lg font-semibold shadow">
          Chat IA 💬
        </header>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.length === 0 && (
            <div className="text-gray-500 text-center mt-20">
              Comienza una conversación ✨
            </div>
          )}

          {/* CAMBIO 2: Usar 'Message' en lugar de 'UIMessage' */}
          {messages.map((m: Message) => {
            const isUser = m.role === "user";
            return (
              <div
                key={m.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] shadow ${
                    isUser
                      ? "bg-indigo-500 text-white rounded-t-2xl rounded-bl-2xl"
                      : "bg-gray-200 text-gray-900 rounded-t-2xl rounded-br-2xl"
                  }`}
                >
                  <div className="px-4 py-3">
                    {/* CAMBIO 3: Usar 'm.content' (para texto) y no 'm.display' */}
                    <div className="whitespace-pre-wrap break-words">
                      {m.content}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="text-gray-500 italic text-center">
              IA está escribiendo...
            </div>
          )}

          {error && (
            <div className="text-red-600 bg-red-100 p-3 rounded-lg text-center">
              <strong>Error:</strong>{" "}
              {error.message || "Hubo un problema con la API."}
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 border-t border-gray-200 bg-gray-100 px-4 py-3"
        >
          <input
            type="text"
            className="flex-1 px-5 py-3 rounded-full bg-white border border-gray-300 text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            placeholder="Escribe tu mensaje..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 active:scale-95 transition focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-gray-400 shadow"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </main>
  );
}