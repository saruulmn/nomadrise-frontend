import NextAuth from "next-auth";
import authConfig from "./auth.config";

const DJANGO_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account }) {
      // On initial sign in, exchange provider token for Django JWT
      if (account) {
        try {
          let res: Response | null = null;

          if (account.provider === 'google' && account.id_token) {
            res = await fetch(`${DJANGO_API_URL}/auth/social/google/`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id_token: account.id_token }),
            });
          } else if (account.provider === 'facebook' && account.access_token) {
            res = await fetch(`${DJANGO_API_URL}/auth/social/facebook/`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ access_token: account.access_token }),
            });
          }

          if (res) {
            if (!res.ok) {
              console.error("Django social auth failed:", res.status, await res.text());
              throw new Error("Django auth failed");
            }
            const data = await res.json();
            token.djangoAccess = data.access;
            token.djangoRefresh = data.refresh;
            if (data.user) {
              token.djangoUser = data.user;
            }
          }
        } catch (error) {
          console.error("Error exchanging token with Django:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.djangoAccess = (token.djangoAccess as string) || "";
      session.djangoRefresh = (token.djangoRefresh as string) || "";
      if (token.djangoUser) {
        session.user = {
          ...session.user,
          ...(token.djangoUser as Record<string, unknown>),
        };
      }
      return session;
    },
  },
});
