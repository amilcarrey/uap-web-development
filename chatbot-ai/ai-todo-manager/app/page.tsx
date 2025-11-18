"use client";

import { useChat, type Message } from "ai/react";

export default function Page() {
  const { messages, input, handleInputChange, handleSubmit } =
    useChat({
      api: "/api/chat",
    });

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">AI Todo Manager</h1>

      <div className="border rounded p-3 h-[60vh] overflow-y-auto">
        {messages.map((m: Message) => (
          <div key={m.id} className={m.role === "user" ? "text-right" : "text-left"}>
            <p className="p-2">{m.content}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex">
        <input
          className="grow border p-2 rounded"
          value={input}
          onChange={handleInputChange}
          placeholder="Escribe algo..."
        />

        <button className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">
          Enviar
        </button>
      </form>
    </main>
  );
}
