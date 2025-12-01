"use client";

import { useState } from "react";

export default function ChatInput({ onSend }: { onSend: (msg: string) => void }) {
  const [msg, setMsg] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!msg.trim()) return;
    onSend(msg);
    setMsg("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        className="flex-1 border p-2 rounded"
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        placeholder="Escribe un mensaje..."
      />
      <button className="px-4 bg-blue-600 text-white rounded">
        Enviar
      </button>
    </form>
  );
}
