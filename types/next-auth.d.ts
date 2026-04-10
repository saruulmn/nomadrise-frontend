import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    djangoAccess: string;
    djangoRefresh: string;
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
    djangoAccess?: string;
    djangoRefresh?: string;
    djangoUser?: unknown;
    provider?: string;
    providerAccountId?: string;
    accessToken?: string;
    backendUserId?: number;
  }
}
