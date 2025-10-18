'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Message } from '@/components/chat/MessageBubble';
import {
  DEFAULT_MODEL,
  LEGACY_MESSAGES_STORAGE_KEY,
  MAX_SESSION_MESSAGES,
  SESSION_STORAGE_KEY,
} from '@/lib/constants';

interface ChatSessionMetadata {
  createdAt: string;
  model: string;
  systemPrompt?: string;
}

interface StoredChatSessionCandidate {
  metadata: unknown;
  messages: unknown;
}

interface StoredChatSession {
  metadata: ChatSessionMetadata;
  messages: Message[];
}

interface UseChatStateOptions {
  initialMessages: Message[];
  model?: string;
  systemPrompt?: string;
}

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

function isMetadataCandidate(value: unknown): value is Partial<ChatSessionMetadata> {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Partial<ChatSessionMetadata>;
  const createdAtValid =
    candidate.createdAt === undefined || typeof candidate.createdAt === 'string';
  const modelValid = candidate.model === undefined || typeof candidate.model === 'string';
  const systemPromptValid =
    candidate.systemPrompt === undefined || typeof candidate.systemPrompt === 'string';

  return createdAtValid && modelValid && systemPromptValid;
}

function isStoredChatSessionCandidate(value: unknown): value is StoredChatSessionCandidate {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  return 'metadata' in value && 'messages' in value;
}

function truncateMessages(messages: Message[]): Message[] {
  if (MAX_SESSION_MESSAGES <= 0) {
    return [];
  }

  return messages.slice(-MAX_SESSION_MESSAGES);
}

function createMetadata(model?: string, systemPrompt?: string): ChatSessionMetadata {
  return {
    createdAt: new Date().toISOString(),
    model: model ?? DEFAULT_MODEL,
    ...(systemPrompt ? { systemPrompt } : {}),
  };
}

function normalizeMetadata(
  candidate: unknown,
  fallback: ChatSessionMetadata,
  overrides: { model?: string; systemPrompt?: string },
): ChatSessionMetadata {
  const metadataCandidate = isMetadataCandidate(candidate) ? candidate : {};

  const createdAt =
    typeof metadataCandidate.createdAt === 'string' ? metadataCandidate.createdAt : fallback.createdAt;
  const model =
    overrides.model ??
    (typeof metadataCandidate.model === 'string' ? metadataCandidate.model : fallback.model);

  const systemPrompt =
    overrides.systemPrompt !== undefined
      ? overrides.systemPrompt
      : typeof metadataCandidate.systemPrompt === 'string'
      ? metadataCandidate.systemPrompt
      : fallback.systemPrompt;

  return {
    createdAt,
    model,
    ...(systemPrompt ? { systemPrompt } : {}),
  };
}

function normalizeMessages(candidate: unknown, fallback: Message[]): Message[] {
  if (isMessageArray(candidate)) {
    return truncateMessages(candidate);
  }

  return truncateMessages(fallback);
}

export function useChatState({ initialMessages, model, systemPrompt }: UseChatStateOptions) {
  const initialMessagesRef = useRef<Message[]>(truncateMessages(initialMessages));
  const [messagesState, setMessagesState] = useState<Message[]>(() => initialMessagesRef.current);
  const [isInitialized, setIsInitialized] = useState(false);
  const metadataRef = useRef<ChatSessionMetadata>(createMetadata(model, systemPrompt));

  useEffect(() => {
    initialMessagesRef.current = truncateMessages(initialMessages);

    if (!isInitialized) {
      setMessagesState(initialMessagesRef.current);
    }
  }, [initialMessages, isInitialized]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const fallbackMetadata = createMetadata(model, systemPrompt);
    let resolvedMetadata = normalizeMetadata(metadataRef.current, fallbackMetadata, {
      model,
      systemPrompt,
    });
    let resolvedMessages = initialMessagesRef.current;

    try {
      const storedValue = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (storedValue) {
        const parsed = JSON.parse(storedValue);
        if (isStoredChatSessionCandidate(parsed)) {
          resolvedMetadata = normalizeMetadata(parsed.metadata, fallbackMetadata, {
            model,
            systemPrompt,
          });
          resolvedMessages = normalizeMessages(parsed.messages, initialMessagesRef.current);
        }
      } else {
        const legacyValue = window.sessionStorage.getItem(LEGACY_MESSAGES_STORAGE_KEY);
        if (legacyValue) {
          const parsedLegacy = JSON.parse(legacyValue);
          if (isMessageArray(parsedLegacy)) {
            resolvedMessages = normalizeMessages(parsedLegacy, initialMessagesRef.current);
            try {
              window.sessionStorage.removeItem(LEGACY_MESSAGES_STORAGE_KEY);
            } catch (legacyCleanupError) {
              console.warn('No se pudo limpiar el historial antiguo del chat.', legacyCleanupError);
            }
          }
        }
      }
    } catch (error) {
      console.warn('No se pudo restaurar el historial del chat desde sessionStorage.', error);
    }

    metadataRef.current = resolvedMetadata;
    setMessagesState(resolvedMessages);
    metadataRef.current = normalizeMetadata(metadataRef.current, metadataRef.current, {
      model,
      systemPrompt,
    });
    setIsInitialized(true);
  }, [initialMessages, model, systemPrompt]);

  useEffect(() => {
    if (!isInitialized || typeof window === 'undefined') {
      return;
    }

    try {
      metadataRef.current = normalizeMetadata(metadataRef.current, metadataRef.current, {
        model,
        systemPrompt,
      });

      const payload: StoredChatSession = {
        metadata: metadataRef.current,
        messages: messagesState,
      };

      window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
      console.warn('No se pudo guardar el historial del chat en sessionStorage.', error);
    }
  }, [messagesState, isInitialized, model, systemPrompt]);

  const setMessages = useCallback<React.Dispatch<React.SetStateAction<Message[]>>>(
    (value) => {
      setMessagesState((previous) => {
        const nextValue = typeof value === 'function' ? (value as (prev: Message[]) => Message[])(previous) : value;
        return truncateMessages(nextValue);
      });
    },
    [],
  );

  const pushMessage = useCallback((message: Message | Message[]) => {
    setMessages((prev) => {
      const nextMessages = Array.isArray(message) ? message : [message];
      return [...prev, ...nextMessages];
    });
  }, [setMessages]);

  const clearMessages = useCallback(() => {
    metadataRef.current = createMetadata(model, systemPrompt);
    setMessages(initialMessagesRef.current.slice());
    if (typeof window !== 'undefined') {
      try {
        window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
      } catch (error) {
        console.warn('No se pudo limpiar el historial del chat en sessionStorage.', error);
      }

      try {
        window.sessionStorage.removeItem(LEGACY_MESSAGES_STORAGE_KEY);
      } catch (error) {
        console.warn('No se pudo limpiar el historial antiguo del chat en sessionStorage.', error);
      }
    }
  }, [model, systemPrompt, setMessages]);

  return {
    messages: messagesState,
    setMessages,
    pushMessage,
    clearMessages,
  } as const;
}
