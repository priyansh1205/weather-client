import { AppError } from '../errors';
import { logger } from '../logger';

interface FetchOptions extends RequestInit {
  timeout?: number;
}

export async function apiClient<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const { timeout = 10000, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      throw new AppError(
        data.error?.message || 'Request failed',
        response.status,
        data.error?.code || 'REQUEST_FAILED',
        true,
        data.error?.details
      );
    }

    return data as T;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof AppError) {
      throw error;
    }

    if ((error as Error).name === 'AbortError') {
      logger.error('Request timeout:', url);
      throw new AppError('Request timeout', 408, 'TIMEOUT');
    }

    logger.error('API Client Error:', error);
    throw new AppError('Network error', 500, 'NETWORK_ERROR');
  }
}
