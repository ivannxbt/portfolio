import { getServerSession } from "next-auth";

import { getAuthOptions, NEXTAUTH_SECRET_ERROR } from "@/lib/auth";

export type AuthenticatedSession = {
  email?: string | null;
};

export type SessionValidationResult =
  | { ok: true; session: AuthenticatedSession }
  | { ok: false; status: number; error: string };

export interface SessionValidator {
  validateSession(): Promise<SessionValidationResult>;
}

class NextAuthSessionValidator implements SessionValidator {
  async validateSession(): Promise<SessionValidationResult> {
    const authOptions = getAuthOptions();

    if (!authOptions) {
      console.error("Auth validation blocked:", NEXTAUTH_SECRET_ERROR);
      return { ok: false, status: 500, error: NEXTAUTH_SECRET_ERROR };
    }

    const session = await getServerSession(authOptions);

    if (!session) {
      return { ok: false, status: 401, error: "Unauthorized" };
    }

    return {
      ok: true,
      session: {
        email: session.user?.email,
      },
    };
  }
}

export function createSessionValidator(): SessionValidator {
  return new NextAuthSessionValidator();
}
