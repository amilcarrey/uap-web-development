/**
 * Shared type definitions for the chatbot application.
 * TODO: Expand once the API surface grows (streaming, tool calls, etc.).
 */

/**
 * Role supported by the chat UI and backend.
 */
export type Role = 'user' | 'assistant' | 'system';

/**
 * Shape of a single chat message.
 */
export interface Message {
  /** Optional identifier assigned by the backend or persistence layer. */
  id?: string;
  /** Who generated the message. */
  role: Role;
  /** Markdown-friendly content authored by the role. */
  content: string;
  /** When the message was created. Useful for ordering. */
  createdAt?: Date;
  /** Whether the message is still pending confirmation from the server. */
  pending?: boolean;
}

/**
 * Minimal representation of an error that can be surfaced to the UI.
 */
export interface ErrorShape {
  /** Machine readable code such as `RATE_LIMITED` or `VALIDATION_ERROR`. */
  code: string;
  /** Human readable explanation aimed at developers/users. */
  message: string;
  /** Arbitrary metadata to help debugging (kept intentionally loose). */
  details?: Record<string, unknown>;
  /** Original cause (when available) for logging purposes. */
  cause?: unknown;
}

/**
 * Configuration shared between UI components when performing a chat request.
 */
export interface ChatRequest {
  /** The prompt or array of messages to send to the model. */
  messages: Message[];
  /** Identifier of the model the user selected. */
  model: string;
  /** Optional signal for aborting outstanding requests. */
  signal?: AbortSignal;
}

/**
 * Result returned by the backend when streaming is not required.
 */
export interface ChatResponse {
  /** The message produced by the model. */
  message: Message;
  /** Optional warnings sent by the backend. */
  warnings?: string[];
}

/**
 * Utility type for functions that can return either a value or an error.
 */
export type Result<T> = { data: T; error?: undefined } | { data?: undefined; error: ErrorShape };
