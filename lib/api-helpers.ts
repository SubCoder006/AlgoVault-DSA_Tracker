import { NextResponse } from 'next/server';

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}
export function apiError(message: string, status = 500) {
  return NextResponse.json({ success: false, error: message }, { status });
}
export const unauthorized = () => apiError('Unauthorized — please sign in.', 401);
export const notFound     = (msg = 'Resource not found.')   => apiError(msg, 404);
export const badRequest   = (msg = 'Invalid request data.') => apiError(msg, 400);