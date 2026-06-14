/**
 * types/next-auth.d.ts
 * Augments NextAuth's built-in types so TypeScript knows about
 * the `id` field we add to the session and JWT token in lib/auth.ts.
 */

import { DefaultSession, DefaultJWT } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
  }
}