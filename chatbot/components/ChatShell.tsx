"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useChat, type UIMessage } from "@ai-sdk/react";
import { MAX_MESSAGE_CHARS, sanitizeText } from "@/lib/sanitize";
import { MessageBubble } from "@/components/MessageBubble";

const STORAGE_KEY = "orchat:messages:v1";

function useDebouncedEffect(effect: () => void, deps: unknown[], delayMs: number) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const t = setTimeout(effect, delayMs);
    return () => clearTimeout(t);
  }, deps);
}

function loadSessionMessages(): UIMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as UIMessage[]) : [];
  } catch {
    return [];
  }
}

function saveSessionMessages(messages: UIMessage[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // storage full / blocked -> ignore
  }
}

export function ChatShell() {
  const [hydrated, setHydrated] = useState(false);
  const [initialMessages, setInitialMessages] = useState<UIMessage[]>([]);
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setInitialMessages(loadSessionMessages());
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
          <div className="animate-pulse text-zinc-300">Cargando…</div>
        </div>
      </div>
    );
  }

  return <ChatShellInner initialMessages={initialMessages} input={input} setInput={setInput} listRef={listRef} />;
}

function ChatShellInner({
  initialMessages,
  input,
  setInput,
  listRef
}: {
  initialMessages: UIMessage[];
  input: string;
  setInput: (s: string) => void;
  listRef: React.RefObject<HTMLDivElement | null>;
}) {
  const chat = useChat({
    messages: initialMessages,
    // reduce re-renders durante streaming
    experimental_throttle: 60,
    onError: (e) => {
      console.error(e);
    }
  });
  const { messages, status, error, clearError, sendMessage, stop, regenerate, setMessages } = chat;

  // Persistencia en sesión (debounced)
  useDebouncedEffect(
    () => {
      saveSessionMessages(messages);
    },
    [messages],
    500
  );

  // Auto-scroll al final
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, listRef]);

  const isBusy = status === "submitted" || status === "streaming";
  const remaining = useMemo(() => MAX_MESSAGE_CHARS - input.length, [input.length]);

  function onClear() {
    setMessages([]);
    saveSessionMessages([]);
  }

  async function onSubmit() {
    const cleaned = sanitizeText(input);
    if (!cleaned) return;
    sendMessage({ text: cleaned });
    setInput("");
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex max-w-4xl flex-col px-4 pb-6 pt-10">
        <header className="mb-6 flex items-start justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">

            <button
              type="button"
              onClick={onClear}
              className="rounded-xl border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
            >
              Limpiar
            </button>
          </div>
        </header>

        <main className="flex min-h-[70vh] flex-1 flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/35 shadow-xl">
          <div className="border-b border-zinc-800 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm text-zinc-300">
                Estado:{" "}
                <span className="font-medium text-zinc-100">
                  {status === "ready" ? "Listo" : status === "submitted" ? "Enviando…" : status === "streaming" ? "Escribiendo…" : "Error"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {isBusy ? (
                  <button
                    type="button"
                    onClick={() => stop()}
                    className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 text-sm text-rose-200 hover:bg-rose-500/15"
                  >
                    Detener
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => regenerate()}
                    disabled={messages.length === 0}
                    className="rounded-xl border border-zinc-700 bg-zinc-900/60 px-3 py-1.5 text-sm text-zinc-200 hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Regenerar
                  </button>
                )}
              </div>
            </div>

            {error ? (
              <div className="mt-3 flex items-start justify-between gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-100">
                <div>
                  <div className="font-medium">Error</div>
                  <div className="mt-1 text-rose-100/90">{error.message}</div>
                </div>
                <button
                  type="button"
                  onClick={() => clearError()}
                  className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-2 py-1 text-xs hover:bg-rose-500/15"
                >
                  Cerrar
                </button>
              </div>
            ) : null}
          </div>

          <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
            {messages.length === 0 ? (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 text-zinc-300">
                <div className="font-medium">Arrancá la conversación 👇</div>
                <div className="mt-1 text-sm text-zinc-400">
                  Tip: probá con “Explicame qué es streaming en un chatbot” o “Dame una idea de app para mi negocio”.
                </div>
              </div>
            ) : null}

            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}

            {status === "streaming" ? (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-zinc-300">
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-flex gap-1">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.2s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.1s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400" />
                    </span>
                    escribiendo…
                  </span>
                </div>
              </div>
            ) : null}
          </div>

          <form
            className="border-t border-zinc-800 bg-zinc-950/30 p-4"
            onSubmit={(e) => {
              e.preventDefault();
              void onSubmit();
            }}
          >
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.currentTarget.value)}
                placeholder="Escribí tu mensaje…"
                rows={2}
                className="flex-1 resize-none rounded-2xl border border-zinc-800 bg-zinc-950/50 p-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                maxLength={MAX_MESSAGE_CHARS}
              />
              <button
                type="submit"
                disabled={isBusy || sanitizeText(input).length === 0}
                className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-medium text-zinc-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Enviar
              </button>
            </div>

          </form>
        </main>

        <footer className="mt-6 text-center text-xs text-zinc-500">
        </footer>
      </div>
    </div>
  );
}
