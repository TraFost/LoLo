import { HTTPException } from 'hono/http-exception';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import { StatusCodes } from 'shared/src/http-status';

interface AxiosErrorLike {
  response?: {
    status?: number;
    data?: unknown;
  };
}

function extractRiotMessage(data: unknown, fallbackMessage: string): string {
  if (!data) {
    return fallbackMessage;
  }

  if (typeof data === 'string') {
    return data;
  }

  if (typeof data === 'object' && data !== null) {
    const maybeStatusMessage = (data as any)?.status?.message;
    if (typeof maybeStatusMessage === 'string' && maybeStatusMessage.trim().length > 0) {
      return maybeStatusMessage;
    }

    const maybeMessage = (data as any)?.message;
    if (typeof maybeMessage === 'string' && maybeMessage.trim().length > 0) {
      return maybeMessage;
    }

    try {
      return JSON.stringify(data);
    } catch {}
  }

  return fallbackMessage;
}

export function handleRiotError(
  error: unknown,
  fallbackStatus: ContentfulStatusCode = StatusCodes.BAD_GATEWAY as ContentfulStatusCode,
  fallbackMessage = 'Riot API request failed',
): never {
  const axiosError = error as AxiosErrorLike | undefined;
  const response = axiosError?.response;

  if (response) {
    const status =
      typeof response.status === 'number'
        ? (response.status as ContentfulStatusCode)
        : fallbackStatus;
    const message = extractRiotMessage(response.data, fallbackMessage);

    throw new HTTPException(status, {
      message,
      cause: response.data ?? error,
    });
  }

  throw new HTTPException(fallbackStatus, {
    message: fallbackMessage,
    cause: error,
  });
}
