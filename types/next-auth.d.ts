import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    _at: string;
    _rt: string;
    authError?: string;
    user: {
      id: string;
      pk?: number;
      provider?: string;
      providerAccountId?: string;
      backendUserId?: number;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    provider?: string;
    providerAccountId?: string;
    backendUserId?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    _at?: string;
    _rt?: string;
    djangoUser?: unknown;
    provider?: string;
    providerAccountId?: string;
    accessToken?: string;
    backendUserId?: number;
    authError?: string;
  }
}
