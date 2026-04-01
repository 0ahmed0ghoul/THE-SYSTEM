// frontend/src/utils/error-handler.ts
import { AxiosError } from 'axios';

export class ApiError extends Error {
    public status?: number;
    public code?: string;
    public errors?: Record<string, string[]>;
  
    constructor(
      message: string,
      status?: number,
      code?: string,
      errors?: Record<string, string[]>
    ) {
      super(message);
  
      this.name = 'ApiError';
      this.status = status;
      this.code = code;
      this.errors = errors;
    }
  }

export interface ApiErrorResponse {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

export function handleApiError(error: unknown, defaultMessage: string): ApiError {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse;
    return new ApiError(
      data?.message || defaultMessage,
      error.response?.status,
      data?.code,
      data?.errors
    );
  }
  
  if (error instanceof Error) {
    return new ApiError(error.message);
  }
  
  return new ApiError(defaultMessage);
}