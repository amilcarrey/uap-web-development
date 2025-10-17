'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Message } from '@/components/chat/MessageBubble';

const STORAGE_NAMESPACE = 'chatbot';
const STORAGE_KEY = `${STORAGE_NAMESPACE}:messages`;

function isMessageArray(value: unknown): value is Message[] {
  if (!Array.isArray(value)) {
    return false;
  }

  return value.every((item) => {
    if (typeof item !== 'object' || item === null) {
      return false;
    }

    const candidate = item as Partial<Message>;
    return (
      typeof candidate.id === 'string' &&
      typeof candidate.content === 'string' &&
      typeof candidate.role === 'string'
    );
  });
}

export function useChatState(initialMessages: Message[]) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const storedValue = window.sessionStorage.getItem(STORAGE_KEY);
      if (storedValue) {
        const parsed = JSON.parse(storedValue);
        if (isMessageArray(parsed)) {
          setMessages(parsed);
        }
      }
    } catch (error) {
      console.warn('No se pudo restaurar el historial del chat desde sessionStorage.', error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (!isInitialized || typeof window === 'undefined') {
      return;
    }

    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.warn('No se pudo guardar el historial del chat en sessionStorage.', error);
    }
  }, [messages, isInitialized]);

  const pushMessage = useCallback((message: Message | Message[]) => {
    setMessages((prev) => {
      const nextMessages = Array.isArray(message) ? message : [message];
      return [...prev, ...nextMessages];
    });
  }, []);

  const clearMessages = useCallback(() => {
    setMessages(initialMessages);
    if (typeof window !== 'undefined') {
      try {
        window.sessionStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.warn('No se pudo limpiar el historial del chat en sessionStorage.', error);
      }
    }
  }, [initialMessages]);

  return {
    messages,
    setMessages,
    pushMessage,
    clearMessages,
  } as const;
}
