'use client';

import { useChat } from 'ai/react';
import { FormEvent, useEffect, useMemo, useRef } from 'react';

const roleLabel: Record<string, string> = {
  user: 'Tú',
  assistant: 'Asistente',
  system: 'Sistema',
  tool: 'Tool',
};

const roleStyles: Record<
  string,
  {
    bubble: string;
    chip: string;
    align: string;
  }
> = {
  user: {
    bubble: 'bg-gradient-to-br from-cyan-500/40 to-blue-600/30 border-cyan-500/40 text-white shadow-cyan-500/30',
    chip: 'bg-cyan-500/20 text-cyan-100 border border-cyan-500/30',
    align: 'items-end',
  },
  assistant: {
    bubble: 'bg-white/5 border-white/10 text-slate-100 shadow-blue-500/20',
    chip: 'bg-white/10 text-blue-100 border border-white/20',
    align: 'items-start',
  },
  system: {
    bubble: 'bg-amber-500/10 border-amber-500/40 text-amber-50 shadow-amber-500/20',
    chip: 'bg-amber-500/20 text-amber-100 border border-amber-500/30',
    align: 'items-start',
  },
  tool: {
    bubble: 'bg-emerald-500/10 border-emerald-400/40 text-emerald-50 shadow-emerald-500/20',
    chip: 'bg-emerald-500/20 text-emerald-100 border border-emerald-500/30',
    align: 'items-start',
  },
  default: {
    bubble: 'bg-white/10 border-white/20 text-white shadow-black/20',
    chip: 'bg-white/10 text-white border border-white/20',
    align: 'items-start',
  },
};

export function ChatPanel() {
  const { messages, handleSubmit, handleInputChange, input, isLoading, stop, setInput } = useChat({ api: '/api/chat' });
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  const friendlyMessages = useMemo(
    () =>
      messages.map((message) => ({
        ...message,
        displayName: roleLabel[message.role] || message.role,
      })),
    [messages],
  );

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim()) return;
    handleSubmit(event);
  };

  const quickPrompts = [
    {
      label: 'Añadir libro (tool)',
      prompt: 'Agrega “Project Hail Mary” con prioridad alta y nota: revisar en grupo de lectura',
    },
    {
      label: 'Buscar y resumir',
      prompt: 'Busca en Google Books novelas de misterio y añade las dos mejores al dashboard de lectura',
    },
  ];

  return (
    <div className="flex flex-col gap-6 rounded-[40px] border border-white/10 bg-gradient-to-br from-[#0b1120] via-[#050815] to-[#02040b] p-6 text-slate-50 shadow-[0_25px_80px_rgba(5,7,20,0.65)] backdrop-blur-xl">
      <header className="grid gap-3 rounded-[28px] border border-white/10 bg-white/5 p-4 backdrop-blur">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-300">Terminal táctico</p>
          <h2 className="text-2xl font-black text-white">Oráculo de lectura</h2>
          <p className="text-sm text-slate-300">
            Envía instrucciones y el asistente buscará, clasificará y registrará hallazgos en tu bitácora de lectura.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/70">
          <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1 text-cyan-200">/api/chat</span>
          {isLoading ? (
            <span className="rounded-full border border-amber-400/40 bg-amber-500/10 px-4 py-1 text-amber-200">Procesando…</span>
          ) : (
            <span className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-1 text-emerald-200">Listo</span>
          )}
        </div>
      </header>

      <div
        ref={scrollRef}
        className="h-[440px] space-y-4 overflow-y-auto rounded-[32px] border border-white/5 bg-gradient-to-b from-white/5 via-transparent to-white/5 p-4 shadow-inner shadow-cyan-500/5"
      >
        {friendlyMessages.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-5 text-sm text-slate-200">
            Pide recomendaciones por género, autor o estado de ánimo. El asistente puede consultar catálogos, registrar avances y
            sumar estadísticas en tiempo real.
          </div>
        )}

        {friendlyMessages.map((message) => (
          <div key={message.id} className={`flex ${roleStyles[message.role]?.align || roleStyles.default.align}`}>
            <div
              className={`w-full max-w-[520px] space-y-2 rounded-3xl border px-4 py-3 text-sm leading-relaxed shadow-lg ${
                roleStyles[message.role]?.bubble || roleStyles.default.bubble
              }`}
            >
              <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/60">
                <span
                  className={`rounded-full px-3 py-1 ${roleStyles[message.role]?.chip || roleStyles.default.chip}`}
                >
                  {message.displayName}
                </span>
                <span className="text-white/40">{message.role}</span>
              </div>
              <p className="whitespace-pre-wrap text-base leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}
      </div>

      <form ref={formRef} onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
          <span>Secuencias rápidas</span>
          <span className="text-white/30">Pulsa para ejecutar</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                setInput(item.prompt);
                queueMicrotask(() => formRef.current?.requestSubmit());
              }}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-400/50 hover:bg-cyan-500/10 disabled:opacity-40"
              disabled={isLoading}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-3 rounded-[28px] border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-4 shadow-inner shadow-cyan-500/10">
          <label className="text-sm font-semibold uppercase tracking-[0.35em] text-white/70" htmlFor="message">
            Consola
          </label>
          <textarea
            id="message"
            name="message"
            value={input}
            onChange={(event) => {
              const sanitized = event.target.value.slice(0, 800);
              if (sanitized !== event.target.value) {
                event.target.value = sanitized;
              }
              handleInputChange(event);
            }}
            className="min-h-[110px] w-full resize-none rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-base text-white placeholder-white/40 shadow-cyan-500/10 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            placeholder="Ej. Diseña una lista de ensayos afrofuturistas y márcalos con prioridad crítica."
            required
            maxLength={800}
          />
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-white/50">
            <span>Los comandos se envían directo al orquestador del backend.</span>
            <div className="flex items-center gap-2">
              {isLoading && (
                <button
                  type="button"
                  onClick={() => stop()}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Detener
                </button>
              )}
              <button
                type="submit"
                className="rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:scale-[1.01] disabled:opacity-50"
                disabled={isLoading}
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
