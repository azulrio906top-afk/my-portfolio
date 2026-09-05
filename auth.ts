import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { ensureDatabase, prisma } from "@/lib/db";
import {
    ADMIN_EMAIL,
    ADMIN_PASSWORD,
} from "@/lib/admin";

/*
 * ---------------------------------------------------------
 * AUTHENTICATION
 * ---------------------------------------------------------
 *
 * Authentication:
 *   NextAuth Credentials
 *
 * Session:
 *   JWT
 *
 * Password:
 *   bcrypt
 *
 * The environment credentials are used as a bootstrap
 * account when the database does not yet contain the
 * administrator.
 * ---------------------------------------------------------
 */

export const {
    handlers,
    signIn,
    signOut,
    auth,
} = NextAuth({
    secret: process.env.AUTH_SECRET,

    session: {
        strategy: "jwt",
    },

    pages: {
        signIn: "/admin/login",
    },

    providers: [
        Credentials({
            name: "Admin credentials",

            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "admin@example.com",
                },

                password: {
                    label: "Password",
                    type: "password",
                },
            },

            async authorize(credentials) {
                if (
                    !credentials?.email ||
                    !credentials?.password
                ) {
                    return null;
                }

                const email = String(credentials.email)
                    .trim()
                    .toLowerCase();

                const password = String(
                    credentials.password,
                );

                if (!email || !password) {
                    return null;
                }

                /*
                 * Make sure Prisma/database is ready.
                 */
                try {
                    await ensureDatabase();
                } catch (error) {
                    console.error(
                        "Database initialization failed:",
                        error,
                    );

                    /*
                     * Continue so the bootstrap admin can
                     * still authenticate.
                     */
                }

                /*
                 * -------------------------------------------------
                 * BOOTSTRAP ADMIN
                 * -------------------------------------------------
                 *
                 * Allows the application to start with an
                 * administrator even when AdminUser has not
                 * been seeded yet.
                 */

                const isBootstrapAdmin =
                    email ===
                    ADMIN_EMAIL.trim().toLowerCase() &&
                    password === ADMIN_PASSWORD;

                if (isBootstrapAdmin) {
                    try {
                        const existingAdmin =
                            await prisma.adminUser.findUnique({
                                where: {
                                    email: ADMIN_EMAIL
                                        .trim()
                                        .toLowerCase(),
                                },
                            });

                        if (existingAdmin) {
                            return {
                                id: existingAdmin.id,
                                name: existingAdmin.name,
                                email: existingAdmin.email,
                                role: existingAdmin.role,
                            };
                        }

                        const passwordHash =
                            await bcrypt.hash(
                                ADMIN_PASSWORD,
                                12,
                            );

                        const admin =
                            await prisma.adminUser.create({
                                data: {
                                    name: "Portfolio Admin",
                                    email: ADMIN_EMAIL
                                        .trim()
                                        .toLowerCase(),
                                    passwordHash,
                                    role: "admin",
                                },
                            });

                        return {
                            id: admin.id,
                            name: admin.name,
                            email: admin.email,
                            role: admin.role,
                        };
                    } catch (error) {
                        console.error(
                            "Bootstrap admin error:",
                            error,
                        );

                        /*
                         * Database may not be available yet.
                         * Allow environment credentials to
                         * authenticate the administrator.
                         */

                        return {
                            id: "admin-bootstrap",
                            name: "Portfolio Admin",
                            email: ADMIN_EMAIL,
                            role: "admin",
                        };
                    }
                }

                /*
                 * -------------------------------------------------
                 * DATABASE ADMIN
                 * -------------------------------------------------
                 */

                try {
                    const admin =
                        await prisma.adminUser.findUnique({
                            where: {
                                email,
                            },
                        });

                    if (!admin) {
                        return null;
                    }

                    /*
                     * Only administrators may access /admin.
                     */

                    if (
                        admin.role.toLowerCase() !==
                        "admin"
                    ) {
                        return null;
                    }

                    const passwordMatches =
                        await bcrypt.compare(
                            password,
                            admin.passwordHash,
                        );

                    if (!passwordMatches) {
                        return null;
                    }

                    return {
                        id: admin.id,
                        name: admin.name,
                        email: admin.email,
                        role: admin.role,
                    };
                } catch (error) {
                    console.error(
                        "Admin authentication error:",
                        error,
                    );

                    return null;
                }
            },
        }),
    ],

    callbacks: {
        /*
         * -------------------------------------------------------
         * JWT
         * -------------------------------------------------------
         *
         * Store the administrator role inside the JWT.
         */

        async jwt({ token, user }) {
            if (user) {
                "role" in user && typeof user.role === "string"
                    ? user.role
                    : undefined;
            }

            return token;
        },

        /*
         * -------------------------------------------------------
         * SESSION
         * -------------------------------------------------------
         *
         * Expose id + role to the application.
         */

        async session({ session, token }) {
            if (session.user) {
                session.user.id =
                    typeof token.sub === "string"
                        ? token.sub
                        : "";

                const user = session.user as typeof session.user & {
                    role?: string;
                };

                user.role =
                    typeof token.role === "string"
                        ? token.role
                        : "";
            }

            return session;
        },
    },
});