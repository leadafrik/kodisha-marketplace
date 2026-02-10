/**
 * API Response utilities and middleware
 */
import { NextResponse } from 'next/server';
import { ApiResponse } from '@/types';

/**
 * Success API response
 */
export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message: message || 'Success',
    },
    { status }
  );
}

/**
 * Error API response
 */
export function errorResponse(
  error: string,
  message?: string,
  status: number = 400
): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    {
      success: false,
      error,
      message: message || error,
    },
    { status }
  );
}

/**
 * Paginated response
 */
export function paginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  status: number = 200
) {
  const totalPages = Math.ceil(total / limit);
  return NextResponse.json(
    {
      success: true,
      data,
      meta: {
        page,
        limit,
        total,
        total_pages: totalPages,
        has_more: page < totalPages,
      },
    },
    { status }
  );
}

/**
 * Extract pagination params from request
 */
export function getPaginationParams(
  searchParams: Record<string, string | string[]>
): { page: number; limit: number } {
  const page = Math.max(1, parseInt(searchParams.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.limit as string) || 20));
  return { page, limit };
}

/**
 * Validate request method
 */
export function validateMethod(
  actualMethod: string,
  expectedMethods: string[]
): boolean {
  return expectedMethods.includes(actualMethod.toUpperCase());
}

/**
 * Extract bearer token from headers
 */
export function getBearerToken(authHeader?: string): string | null {
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
    return parts[1];
  }
  return null;
}

/**
 * Rate limiting helper
 */
export const RATE_LIMITS = {
  LIST_CREATION: { requests: 5, windowMs: 3600000 }, // 5 per hour
  MESSAGE_SENDING: { requests: 30, windowMs: 60000 }, // 30 per minute
  API_GENERAL: { requests: 100, windowMs: 900000 }, // 100 per 15 mins
  AUTH_ATTEMPT: { requests: 5, windowMs: 900000 }, // 5 per 15 mins
} as const;
