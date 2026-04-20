import { logger } from '@/lib/logger';
import i18n from '@/i18n';

export type NormalizedError = {
  name: string;
  message: string;
  stack?: string;
  cause?: unknown;
};

export function normalizeError(error: unknown): NormalizedError {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: (error as Error & { cause?: unknown }).cause,
    };
  }
  if (typeof error === 'string') {
    return { name: 'Error', message: error };
  }
  return {
    name: 'UnknownError',
    message: i18n.t('errors.unknownError'),
    cause: error,
  };
}

export function getErrorMessage(error: unknown) {
  return normalizeError(error).message;
}

export function getErrorStack(error: unknown) {
  return normalizeError(error).stack;
}

export function logError(error: unknown, context = 'AppError') {
  const normalized = normalizeError(error);
  logger.group(`[${context}] ${normalized.name}`, () => {
    logger.error(normalized.message);
    if (normalized.stack) logger.debug(normalized.stack);
    if (normalized.cause !== undefined) logger.debug('cause:', normalized.cause);
  });
}
