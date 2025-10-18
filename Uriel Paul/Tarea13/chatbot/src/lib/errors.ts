export const ERROR_DESCRIPTORS = {
  VALIDATION: {
    status: 400,
    code: 'E_VALIDATION' as const,
    message: 'La solicitud contiene datos inválidos.',
  },
  RATE_LIMIT: {
    status: 429,
    code: 'E_RATE_LIMIT' as const,
    message: 'Has excedido el número de solicitudes permitidas. Intenta nuevamente más tarde.',
  },
  CONFIGURATION: {
    status: 500,
    code: 'E_CONFIG' as const,
    message: 'El servicio no está disponible por un problema de configuración.',
  },
  PROVIDER: {
    status: 502,
    code: 'E_PROVIDER' as const,
    message: 'El proveedor de chat no está disponible en este momento. Intenta de nuevo más tarde.',
  },
  UNKNOWN: {
    status: 500,
    code: 'E_UNKNOWN' as const,
    message: 'Ocurrió un error inesperado. Intenta nuevamente.',
  },
} as const;

export type AppErrorKind = keyof typeof ERROR_DESCRIPTORS;
export type AppErrorDescriptor = (typeof ERROR_DESCRIPTORS)[AppErrorKind];
export type AppErrorCode = AppErrorDescriptor['code'];

const ERROR_DESCRIPTORS_BY_CODE: Record<AppErrorCode, AppErrorDescriptor> = {
  E_VALIDATION: ERROR_DESCRIPTORS.VALIDATION,
  E_RATE_LIMIT: ERROR_DESCRIPTORS.RATE_LIMIT,
  E_CONFIG: ERROR_DESCRIPTORS.CONFIGURATION,
  E_PROVIDER: ERROR_DESCRIPTORS.PROVIDER,
  E_UNKNOWN: ERROR_DESCRIPTORS.UNKNOWN,
};

export interface AppErrorResponseBody {
  error: {
    code: AppErrorCode;
    message: string;
  };
  meta?: Record<string, unknown>;
}

export interface AppErrorState {
  code: AppErrorCode;
  message: string;
  meta?: Record<string, unknown>;
}

export interface ResolveErrorOptions {
  meta?: Record<string, unknown>;
  statusOverride?: number;
}

export interface ResolvedError {
  status: number;
  body: AppErrorResponseBody;
  descriptor: AppErrorDescriptor;
}

export function getErrorDescriptor(kind: AppErrorKind): AppErrorDescriptor {
  return ERROR_DESCRIPTORS[kind];
}

export function getErrorDescriptorByCode(code: AppErrorCode): AppErrorDescriptor {
  return ERROR_DESCRIPTORS_BY_CODE[code];
}

export function isAppErrorCode(value: unknown): value is AppErrorCode {
  return typeof value === 'string' && value in ERROR_DESCRIPTORS_BY_CODE;
}

export function isAppErrorResponseBody(value: unknown): value is AppErrorResponseBody {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const casted = value as { error?: unknown };
  if (!casted.error || typeof casted.error !== 'object') {
    return false;
  }

  const errorObject = casted.error as { code?: unknown; message?: unknown };

  return isAppErrorCode(errorObject.code) && typeof errorObject.message === 'string';
}

export function resolveError(kind: AppErrorKind, options: ResolveErrorOptions = {}): ResolvedError {
  const descriptor = getErrorDescriptor(kind);
  const body: AppErrorResponseBody = {
    error: {
      code: descriptor.code,
      message: descriptor.message,
    },
    ...(options.meta ? { meta: options.meta } : {}),
  };

  return {
    status: options.statusOverride ?? descriptor.status,
    body,
    descriptor,
  };
}

export function normalizeAppErrorState(input: unknown): AppErrorState {
  if (isAppErrorResponseBody(input)) {
    return {
      code: input.error.code,
      message: input.error.message,
      ...(input.meta ? { meta: input.meta } : {}),
    };
  }

  const descriptor = getErrorDescriptor('UNKNOWN');

  return {
    code: descriptor.code,
    message: descriptor.message,
  };
}
