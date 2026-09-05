import { auth } from "@/auth";

export type AdminSession = {
    user: {
        id?: string;
        name?: string | null;
        email?: string | null;
        role?: string;
    };
};

export async function requireAdmin(): Promise<
    | {
          authorized: true;
          session: AdminSession;
      }
    | {
          authorized: false;
          status: 401 | 403;
          error: string;
      }
> {
    const session = await auth();

    if (!session?.user) {
        return {
            authorized: false,
            status: 401,
            error: "Authentication required.",
        };
    }

    const role =
    "role" in session.user &&
    typeof session.user.role === "string"
        ? session.user.role
        : undefined;

    if (role !== "admin") {
        return {
            authorized: false,
            status: 403,
            error: "Administrator access required.",
        };
    }

    return {
        authorized: true,
        session: session as AdminSession,
    };
}