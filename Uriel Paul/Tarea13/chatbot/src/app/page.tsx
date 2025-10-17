'use client';

import { useEffect, useRef, useState } from 'react';
import { ChatInput } from '@/components/chat/ChatInput';
import { Message, MessageBubble } from '@/components/chat/MessageBubble';
import { TypingIndicator } from '@/components/chat/TypingIndicator';

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
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = (message: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: message,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content:
          'Esta es una respuesta de ejemplo. Pronto conectaremos el chat con el modelo real para darte respuestas dinámicas.',
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 via-slate-100 to-white">
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

            <TypingIndicator isTyping={isTyping} />
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-slate-200 bg-white/90 p-4 backdrop-blur sm:p-6">
            <ChatInput
              value={inputValue}
              onChange={setInputValue}
              onSubmit={handleSubmit}
              disabled={isTyping}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
