import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import * as bcrypt from 'bcryptjs';
import { ensureDatabase, prisma } from '@/lib/db';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '@/lib/admin';

declare module 'next-auth' {
  interface User {
    role?: string;
  }

  interface Session {
    user: User & {
      id?: string;
      role?: string;
    };
  }

  interface JWT {
    role?: string;
  }
}

const bcryptLib = (bcrypt as typeof import('bcryptjs') & { default?: typeof import('bcryptjs') }).default ?? bcrypt;

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET || 'dev-secret-change-me',
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/admin/login',
  },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await ensureDatabase();
        } catch {
          // Ignore schema bootstrap failures here and keep the default admin credentials working.
        }

        const email = String(credentials.email).toLowerCase();
        const password = String(credentials.password);

        if (email === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
          try {
            const seededUser = await prisma.adminUser.findUnique({
              where: { email: ADMIN_EMAIL.toLowerCase() },
            });

            if (seededUser) {
              return {
                id: seededUser.id,
                name: seededUser.name,
                email: seededUser.email,
                role: seededUser.role,
              };
            }

            const passwordHash = await bcryptLib.hash(ADMIN_PASSWORD, 10);

            const createdUser = await prisma.adminUser.create({
              data: {
                name: 'Portfolio Admin',
                email: ADMIN_EMAIL,
                passwordHash,
                role: 'admin',
              },
            });

            return {
              id: createdUser.id,
              name: createdUser.name,
              email: createdUser.email,
              role: createdUser.role,
            };
          } catch {
            return {
              id: 'admin-default',
              name: 'Portfolio Admin',
              email: ADMIN_EMAIL,
              role: 'admin',
            };
          }
        }

        try {
          const user = await prisma.adminUser.findUnique({
            where: { email },
          });

          if (!user) {
            return null;
          }

          const isValid = await bcryptLib.compare(password, user.passwordHash);

          if (!isValid) {
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? '';
        session.user.role = typeof token.role === 'string' ? token.role : 'admin';
      }
      return session;
    },
  },
});
