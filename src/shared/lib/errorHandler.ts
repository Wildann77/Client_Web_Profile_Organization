import { toast } from 'sonner';

/**
 * Interface untuk error response dari API (Axios error structure)
 */
interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
      error?: {
        code?: string;
        details?: Record<string, string[]>;
      };
    };
    status?: number;
  };
  message?: string;
}

/**
 * Options untuk error handler
 */
interface ErrorHandlerOptions {
  fallbackMessage?: string;
  showToast?: boolean;
  logError?: boolean;
  context?: string;
  onError?: (message: string) => void;
}

/**
 * Extract error message dari berbagai jenis error
 * Priority: API message > Error message > Fallback
 */
function extractErrorMessage(
  error: unknown,
  fallbackMessage = 'Terjadi kesalahan'
): string {
  const apiError = error as ApiErrorResponse;

  return (
    apiError.response?.data?.message ??
    apiError.message ??
    fallbackMessage
  );
}

/**
 * Handle error dengan toast notification dan logging
 * @returns Error message yang diextract
 */
function handleError(
  error: unknown,
  options: ErrorHandlerOptions = {}
): string {
  const {
    fallbackMessage = 'Terjadi kesalahan',
    showToast = true,
    logError = true,
    context,
    onError,
  } = options;

  const message = extractErrorMessage(error, fallbackMessage);

  // Log untuk debugging
  if (logError) {
    const logPrefix = context ? `[${context}]` : '[Error]';
    console.error(`${logPrefix}`, error);
  }

  // Show toast notification
  if (showToast) {
    toast.error(message);
  }

  // Custom handler jika disediakan
  if (onError) {
    onError(message);
  }

  return message;
}

/**
 * Factory function untuk membuat error handler khusus TanStack Query mutations
 */
function createMutationErrorHandler(
  options: ErrorHandlerOptions = {}
) {
  return (error: Error) => {
    handleError(error, options);
  };
}

/**
 * Handle error untuk form submissions (tanpa toast, return message saja)
 */
function handleFormError(
  error: unknown,
  options: Omit<ErrorHandlerOptions, 'showToast' | 'onError'> = {}
): string {
  return handleError(error, {
    ...options,
    showToast: false,
  });
}

/**
 * Handle error secara silent (hanya log, tidak ada UI feedback)
 */
function handleSilentError(
  error: unknown,
  options: Omit<ErrorHandlerOptions, 'showToast' | 'onError'> = {}
): void {
  handleError(error, {
    ...options,
    showToast: false,
    logError: true,
  });
}

export {
  extractErrorMessage,
  handleError,
  createMutationErrorHandler,
  handleFormError,
  handleSilentError,
};

export type { ApiErrorResponse, ErrorHandlerOptions };
