"use client";

import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();

    const botMessage = {
      role: "assistant",
      content: data.reply,
    };

    setMessages((prev) => [...prev, botMessage]);
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl mb-6">Chatbot</h1>

      <div className="flex flex-col gap-4 mb-6">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg max-w-xl ${
              msg.role === "user"
                ? "bg-blue-600 self-end"
                : "bg-gray-800 self-start"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 p-2 rounded bg-gray-900 text-white"
          placeholder="Escribe un mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 px-4 py-2 rounded"
        >
          Enviar
        </button>
      </div>
    </main>
  );
}
