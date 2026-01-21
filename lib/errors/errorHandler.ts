import { AppError } from './AppError';
import { logger } from '../logger';

// Conditional import for Next.js (only in server context)
let NextResponse: any;
if (typeof window === 'undefined') {
  try {
    NextResponse = require('next/server').NextResponse;
  } catch {
    // Fallback for test environment
    NextResponse = {
      json: (data: any, init?: any) => ({
        status: init?.status || 200,
        json: async () => data,
      }),
    };
  }
}

export function handleApiError(error: unknown) {
  logger.error('API Error:', error);

  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error.message,
          code: error.code,
          status: error.statusCode,
          ...(process.env.NODE_ENV === 'development' && { details: error.details }),
        },
      },
      { status: error.statusCode }
    );
  }

  const message =
    process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred'
      : error instanceof Error
      ? error.message
      : 'Unknown error';

  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        code: 'INTERNAL_ERROR',
        status: 500,
      },
    },
    { status: 500 }
  );
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}
