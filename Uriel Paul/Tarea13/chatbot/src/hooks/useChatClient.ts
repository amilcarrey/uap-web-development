'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Message } from '@/components/chat/MessageBubble';
import { RATE_LIMIT_MAX_REQUESTS } from '@/lib/constants';
import { normalizeAppErrorState, type AppErrorState } from '@/lib/errors';
import { sanitizeHTML } from '@/lib/sanitize';
import { chatRequestSchema, messageContentSchema } from '@/lib/validation';
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
  error: AppErrorState | null;
  clearError: () => void;
}

export function useChatClient({ initialMessages, model }: UseChatClientOptions): UseChatClientResult {
  const { messages, setMessages, pushMessage } = useChatState({ initialMessages, model });
  const [isStreaming, setIsStreaming] = useState(false);
  const [lastError, setLastError] = useState<AppErrorState | null>(null);

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

  const clearError = useCallback(() => {
    setLastError(null);
  }, []);

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
      if (isStreamingRef.current) {
        return;
      }

      clearError();

      const contentValidation = messageContentSchema.safeParse(rawContent);

      if (!contentValidation.success) {
        console.warn('Mensaje inválido, se descarta el envío.', contentValidation.error.flatten());
        return;
      }

      const sanitizedContent = sanitizeHTML(contentValidation.data).trim();

      if (!sanitizedContent) {
        console.warn('El mensaje quedó vacío tras la sanitización, se cancela el envío.');
        return;
      }

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content: sanitizedContent,
      };
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '',
      };

      assistantMessageIdRef.current = assistantMessage.id;

      const historyWithUser = [...messagesSnapshotRef.current, userMessage];
      const recentHistory = historyWithUser.slice(-RATE_LIMIT_MAX_REQUESTS);

      const preparedMessages = recentHistory
        .map((message) => {
          const sanitized = sanitizeHTML(message.content);
          const normalized = sanitized.trim();

          if (!normalized) {
            return null;
          }

          return {
            role: message.role,
            content: sanitized,
          };
        })
        .filter(
          (message): message is { role: 'user' | 'assistant' | 'system'; content: string } =>
            message !== null,
        );

      if (preparedMessages.length === 0) {
        console.warn('La solicitud no contiene mensajes válidos tras la sanitización.');
        return;
      }

      const requestCandidate = {
        messages: preparedMessages,
        ...(model ? { model } : {}),
      };

      const requestValidation = chatRequestSchema.safeParse(requestCandidate);

      if (!requestValidation.success) {
        console.warn('La solicitud del chat no superó la validación.', requestValidation.error.flatten());
        return;
      }

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
          body: JSON.stringify(requestValidation.data),
          signal: controller.signal,
        });

        if (!response.ok || !response.body) {
          const contentType = response.headers.get('content-type') ?? '';
          let parsedError: unknown;

          if (contentType.includes('application/json')) {
            parsedError = await response.json().catch(() => undefined);
          } else {
            parsedError = await response.text().catch(() => undefined);
          }

          const normalizedError = normalizeAppErrorState(parsedError);
          setLastError(normalizedError);
          throw new Error(normalizedError.message);
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
            const currentContent = sanitizeHTML(accumulatedContent);
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

        if (!(error instanceof DOMException) || error.name !== 'AbortError') {
          setLastError((previous) => previous ?? normalizeAppErrorState(error));
        }
      } finally {
        abortControllerRef.current = null;
        assistantMessageIdRef.current = null;
        setIsStreaming(false);
        isStreamingRef.current = false;
      }
    },
    [clearError, model, pushMessage, updateAssistantMessage],
  );

  return useMemo(
    () => ({
      messages,
      isStreaming,
      sendMessage,
      cancel,
      error: lastError,
      clearError,
    }),
    [messages, isStreaming, sendMessage, cancel, lastError, clearError],
  );
}
