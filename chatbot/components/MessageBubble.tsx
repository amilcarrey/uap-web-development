"use client";

import type { UIMessage } from "@ai-sdk/react";

function renderParts(message: UIMessage) {
  return message.parts
    .filter((part: any) => part?.type === "text")
    .map((part: any, idx: number) => (
      <p key={`${message.id}-${idx}`} className="whitespace-pre-wrap leading-relaxed">
        {part.text}
      </p>
    ));
}

export function MessageBubble({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={[
          "max-w-[85%] rounded-2xl px-4 py-3 shadow-sm",
          isUser
            ? "bg-emerald-500 text-zinc-950"
            : "border border-zinc-800 bg-zinc-900/70 text-zinc-100"
        ].join(" ")}
      >
        <div className="text-xs opacity-75">{isUser ? "Vos" : "AI"}</div>
        <div className="mt-1 space-y-2 text-sm">{renderParts(message)}</div>
      </div>
    </div>
  );
}
