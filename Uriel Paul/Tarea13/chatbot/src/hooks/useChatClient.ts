'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Message } from '@/components/chat/MessageBubble';
import { useChatState } from './useChatState';

interface UseChatClientOptions {
  initialMessages: Message[];
  model?: string;
}

interface UseChatClientResult {
  messages: Message[];
  isStreaming: boolean;
  sendMessage: (content: string) => Promise<void>;
  cancel: () => void;
}

export function useChatClient({ initialMessages, model }: UseChatClientOptions): UseChatClientResult {
  const { messages, setMessages, pushMessage } = useChatState(initialMessages);
  const [isStreaming, setIsStreaming] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const assistantMessageIdRef = useRef<string | null>(null);
  const messagesSnapshotRef = useRef<Message[]>(messages);
  const isStreamingRef = useRef(isStreaming);

  useEffect(() => {
    messagesSnapshotRef.current = messages;
  }, [messages]);

  useEffect(() => {
    isStreamingRef.current = isStreaming;
  }, [isStreaming]);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const updateAssistantMessage = useCallback(
    (messageId: string, updater: (previous: Message) => Message) => {
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message.id === messageId ? updater(message) : message,
        ),
      );
    },
    [setMessages],
  );

  const sendMessage = useCallback(
    async (rawContent: string) => {
      const content = rawContent.trim();
      if (!content || isStreamingRef.current) {
        return;
      }

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
      };
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '',
      };

      assistantMessageIdRef.current = assistantMessage.id;

      const historyPayload = [...messagesSnapshotRef.current, userMessage].map((message) => ({
        role: message.role,
        content: message.content,
      }));

      pushMessage([userMessage, assistantMessage]);
      setIsStreaming(true);
      isStreamingRef.current = true;

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: historyPayload,
            ...(model ? { model } : {}),
          }),
          signal: controller.signal,
        });

        if (!response.ok || !response.body) {
          const errorText = await response.text().catch(() => undefined);
          throw new Error(errorText ?? 'No se pudo obtener una respuesta válida del asistente.');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        let accumulatedContent = '';
        let isDone = false;

        while (!isDone) {
          const { value, done } = await reader.read();
          if (done) {
            accumulatedContent += decoder.decode();
            isDone = true;
          } else if (value) {
            accumulatedContent += decoder.decode(value, { stream: true });
          }

          if (assistantMessageIdRef.current) {
            const currentContent = accumulatedContent;
            updateAssistantMessage(assistantMessageIdRef.current, (previous) => ({
              ...previous,
              content: currentContent,
            }));
          }
        }
      } catch (error) {
        const assistantId = assistantMessageIdRef.current;
        if (assistantId) {
          const fallbackContent =
            error instanceof DOMException && error.name === 'AbortError'
              ? 'La respuesta fue cancelada.'
              : 'Lo siento, ocurrió un problema al obtener la respuesta.';

          updateAssistantMessage(assistantId, (previous) => ({
            ...previous,
            content: previous.content || fallbackContent,
          }));
        }
      } finally {
        abortControllerRef.current = null;
        assistantMessageIdRef.current = null;
        setIsStreaming(false);
        isStreamingRef.current = false;
      }
    },
    [model, pushMessage, updateAssistantMessage],
  );

  return useMemo(
    () => ({
      messages,
      isStreaming,
      sendMessage,
      cancel,
    }),
    [messages, isStreaming, sendMessage, cancel],
  );
}
