const isServerEnvironment = typeof window === 'undefined';

type LogLevel = 'info' | 'warn' | 'error';

type LogMetadata = Record<string, unknown>;

function normalizeMetadata(metadata?: LogMetadata): LogMetadata | undefined {
  if (!metadata) {
    return undefined;
  }

  const entries = Object.entries(metadata).filter(([, value]) => value !== undefined);

  if (entries.length === 0) {
    return undefined;
  }

  return Object.fromEntries(entries);
}

function log(level: LogLevel, message: string, metadata?: LogMetadata) {
  if (!isServerEnvironment) {
    return;
  }

  const normalizedMetadata = normalizeMetadata(metadata);

  if (normalizedMetadata) {
    console[level](`[${message}]`, normalizedMetadata);
  } else {
    console[level](`[${message}]`);
  }
}

export const logger = Object.freeze({
  info(message: string, metadata?: LogMetadata) {
    log('info', message, metadata);
  },
  warn(message: string, metadata?: LogMetadata) {
    log('warn', message, metadata);
  },
  error(message: string, metadata?: LogMetadata) {
    log('error', message, metadata);
  },
});

export type Logger = typeof logger;
