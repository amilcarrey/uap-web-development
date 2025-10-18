/**
 * Collection of reusable constants shared across the chatbot app.
 * TODO: Externalise into environment/config files when persistence arrives.
 */
export const MAX_MESSAGE_LENGTH = 2000;

export const ALLOWED_MODELS = ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo'] as const;

export const DEFAULT_MODEL = ALLOWED_MODELS[0];

export const STORAGE_NAMESPACE = 'chatbot';
export const SESSION_STORAGE_KEY = `${STORAGE_NAMESPACE}:session`;
export const LEGACY_MESSAGES_STORAGE_KEY = `${STORAGE_NAMESPACE}:messages`;

export const MAX_SESSION_MESSAGES = 50;

export const RATE_LIMIT_WINDOW_MS = 15 * 1000; // 15 segundos
export const RATE_LIMIT_MAX_REQUESTS = 10;
