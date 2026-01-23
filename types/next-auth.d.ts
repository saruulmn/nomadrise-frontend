import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
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
    provider?: string;
    providerAccountId?: string;
    accessToken?: string;
    backendUserId?: number;
  }
}
