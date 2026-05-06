import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";
import authConfig from "./auth.config";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8000/api";

function isExpiringSoon(accessToken: string): boolean {
  try {
    const { exp } = jwtDecode<{ exp: number }>(accessToken);
    return Date.now() / 1000 >= exp - 60;
  } catch {
    return true;
  }
}

async function refreshAccessToken(refreshToken: string): Promise<{ access: string; refresh?: string } | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    if (!res.ok) {
      console.error("Token refresh failed:", res.status, await res.text());
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error("Token refresh error:", error);
    return null;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    ...authConfig.providers,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const res = await fetch(`${API_BASE_URL}/auth/login/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });
          if (!res.ok) return null;
          const data = await res.json();
          return {
            id: String(data.user?.id ?? ""),
            email: data.user?.email ?? "",
            name: [data.user?.first_name, data.user?.last_name].filter(Boolean).join(" ") || data.user?.username || "",
            _at: data.access,
            _rt: data.refresh,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account?.type === "credentials" && user) {
        const u = user as { _at?: string; _rt?: string };
        token._at = u._at;
        token._rt = u._rt;
        return token;
      }

      if (account) {
        try {
          let res: Response | null = null;
          let requestBody: Record<string, string> = {};

          if (account.provider === "google") {
            if (account.access_token) {
              requestBody = { access_token: account.access_token };
            } else if (account.id_token) {
              requestBody = { id_token: account.id_token };
            }

            res = await fetch(`${API_BASE_URL}/auth/social/google/`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(requestBody),
            });
          } else if (account.provider === "facebook" && account.access_token) {
            requestBody = { access_token: account.access_token };
            res = await fetch(`${API_BASE_URL}/auth/social/facebook/`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(requestBody),
            });
          }

          if (res) {
            const responseText = await res.text();

            if (!res.ok) {
              console.error("Django social auth failed:", res.status);
              token.authError = "Authentication failed. Please try again.";
              return token;
            }

            const data = JSON.parse(responseText);
            token._at = data.access;
            token._rt = data.refresh;
            if (data.user) {
              token.djangoUser = data.user;
            }
          }
        } catch (error) {
          console.error("Error exchanging token with backend:", error);
          token.authError = "Authentication failed. Please try again.";
        }
      }

      if (token._at && token._rt && isExpiringSoon(token._at as string)) {
        const refreshed = await refreshAccessToken(token._rt as string);
        if (refreshed) {
          token._at = refreshed.access;
          if (refreshed.refresh) token._rt = refreshed.refresh;
          delete token.authError;
        } else {
          token.authError = "Session expired. Please sign in again.";
        }
      }

      return token;
    },

    async session({ session, token }) {
      session._at = (token._at as string) || "";
      if (token.authError) {
        session.authError = token.authError as string;
      }
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