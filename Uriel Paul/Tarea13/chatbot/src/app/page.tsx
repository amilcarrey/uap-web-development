'use client';

import { useEffect, useRef, useState } from 'react';
import { ChatInput } from '@/components/chat/ChatInput';
import type { Message } from '@/components/chat/MessageBubble';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { TypingIndicator } from '@/components/chat/TypingIndicator';
import { useChatClient } from '@/hooks/useChatClient';
import { sanitizeHTML } from '@/lib/sanitize';
import { messageContentSchema } from '@/lib/validation';

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content:
      'Hola, soy tu asistente virtual. Puedo ayudarte a resolver dudas sobre el curso o a planear tus tareas.',
  },
  {
    id: '2',
    role: 'user',
    content: '¡Hola! ¿Me puedes mostrar un ejemplo de cómo organizar mi día de estudio?',
  },
  {
    id: '3',
    role: 'assistant',
    content:
      'Claro. Primero define los temas prioritarios, luego reserva bloques de tiempo con descansos cortos entre ellos.',
  },
];

export default function ChatPage() {
  const { messages, isStreaming, sendMessage, error, clearError } = useChatClient({
    initialMessages,
  });
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const retryAfterSeconds =
    error && typeof error.meta?.['retryAfterSeconds'] === 'number'
      ? Math.max(0, Math.round(Number(error.meta['retryAfterSeconds'])))
      : null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  const handleSubmit = (message: string) => {
    const validation = messageContentSchema.safeParse(message);

    if (!validation.success) {
      return;
    }

    const sanitizedContent = sanitizeHTML(validation.data).trim();

    if (!sanitizedContent) {
      return;
    }

    setInputValue('');
    void sendMessage(sanitizedContent);
  };

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 via-slate-100 to-white">
      {error ? (
        <div className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
          <div className="flex w-full max-w-md items-start gap-3 rounded-2xl border border-red-200 bg-white/90 p-4 text-sm text-red-700 shadow-lg backdrop-blur">
            <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-red-500" aria-hidden="true" />
            <div className="flex-1">
              <p className="font-semibold text-red-800">Ocurrió un problema</p>
              <p className="mt-1 text-red-700">{error.message}</p>
              {retryAfterSeconds !== null ? (
                <p className="mt-2 text-xs text-red-600">
                  Puedes intentar nuevamente en aproximadamente {retryAfterSeconds} segundos.
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={clearError}
              className="rounded-full border border-red-200 px-2 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-50"
            >
              Cerrar
            </button>
          </div>
        </div>
      ) : null}
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-6 sm:px-6 sm:py-10">
        <header className="text-center sm:text-left">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">Chatbot</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">Asistente de estudio</h1>
          <p className="mt-3 text-base text-slate-600 sm:max-w-3xl">
            Interactúa con el asistente para organizar tus tareas, resolver dudas y mantenerte al día con tus objetivos.
          </p>
        </header>

        <section className="mt-6 flex flex-1 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          <div
            className="flex-1 space-y-6 overflow-y-auto bg-gradient-to-b from-white via-slate-50 to-white px-4 py-6 sm:px-8"
            aria-live="polite"
          >
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            <TypingIndicator isTyping={isStreaming} />
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-slate-200 bg-white/90 p-4 backdrop-blur sm:p-6">
            <ChatInput
              value={inputValue}
              onChange={setInputValue}
              onSubmit={handleSubmit}
              disabled={isStreaming}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
