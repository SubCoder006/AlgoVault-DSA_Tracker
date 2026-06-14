/**
 * app/api/auth/[...nextauth]/route.ts
 * NextAuth.js App Router handler.
 * All /api/auth/* requests (sign-in, sign-out, session, callback…)
 * are handled here by delegating to the shared `authOptions`.
 */

import NextAuth        from 'next-auth';
import { authOptions } from '@/lib/auth';
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };