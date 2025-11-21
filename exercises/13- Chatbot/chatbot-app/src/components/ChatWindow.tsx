'use client';

import { useState } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

export function ChatWindow() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (message: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { role: 'user', content: message }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });

      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let assistantMessage = '';

      while (!done) {
        const { value, done: readerDone } = await reader!.read();
        done = readerDone;
        assistantMessage += decoder.decode(value, { stream: true });
        setMessages((prev) => [
          ...prev.filter((msg) => msg.role !== 'assistant'),
          { role: 'assistant', content: assistantMessage },
        ]);
      }
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="h-[600px] overflow-y-auto border rounded-lg p-4 mb-4">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
      </div>
      <ChatInput isLoading={isLoading} onSubmit={handleSubmit} />
    </div>
  );
}