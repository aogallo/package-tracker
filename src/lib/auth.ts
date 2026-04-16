import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { db } from '@/db';
import { admins } from '@/db/schema/admins';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const admin = await db.query.admins.findFirst({
          where: eq(admins.email, credentials.email as string),
        });

        if (!admin) return null;

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          admin.passwordHash
        );

        if (!passwordMatch) return null;

        return { id: admin.id.toString(), email: admin.email, name: admin.name };
      },
    }),
  ],
  session: { strategy: 'jwt', maxAge: 15 * 60 }, // 15 minutes
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
});
