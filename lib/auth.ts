/**
 * lib/auth.ts
 * NextAuth configuration exported as `authOptions`.
 * Imported by both the [...nextauth] route handler and
 * getServerSession() calls inside API routes.
 *
 * Strategy: JWT (stateless – no DB session table needed).
 * Provider:  Credentials (email + hashed password via bcryptjs).
 */

import { NextAuthOptions } from 'next-auth';
import CredentialsProvider  from 'next-auth/providers/credentials';
import bcrypt               from 'bcryptjs';
import { connectDB }        from '@/lib/mongoose';
import User                 from '@/models/User';

export const authOptions: NextAuthOptions = {

  // ── Providers ──────────────────────────────────────────────
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email'    },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await connectDB();

        // Find user (include password field which is select:false by default)
        const user = await User.findOne({ email: credentials.email.toLowerCase() })
          .select('+password')
          .lean();

        if (!user) return null;

        const passwordOk = await bcrypt.compare(credentials.password, user.password as string);
        if (!passwordOk) return null;

        // Return shape NextAuth expects
        return {
          id:    user._id.toString(),
          name:  user.name  as string,
          email: user.email as string,
        };
      },
    }),

    // ── Easily add OAuth providers later ──────────────────────
    // GoogleProvider({
    //   clientId:     process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // }),
  ],

  // ── JWT session strategy ───────────────────────────────────
  session: { strategy: 'jwt' },

  // ── Custom pages ───────────────────────────────────────────
  pages: {
    signIn: '/login',
    error:  '/login',
  },

  // ── Callbacks ──────────────────────────────────────────────
  callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.id    = user.id;
      token.name  = user.name;
      token.email = user.email; // ✅ FIX
    }
    return token;
  },

  async session({ session, token }) {
    if (token && session.user) {
      session.user.id    = token.id as string;
      session.user.name  = token.name as string;
      session.user.email = token.email as string; // ✅ FIX
    }
    return session;
  },
},

  secret: process.env.NEXTAUTH_SECRET,
};