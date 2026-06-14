export { default } from 'next-auth/middleware';
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/problems/:path*',
    '/api/problems/:path*',
    '/api/user/:path*',
  ],
};