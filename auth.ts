import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";
import authConfig from "./auth.config";

const API_BASE_URL = (
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.nomadrise.mn/api"
).replace(/\/$/, "");

type DjangoUser = {
  id?: number | string;
  email?: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  [key: string]: unknown;
};

type LoginResponse = {
  access?: string;
  refresh?: string;
  user?: DjangoUser;
};

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
  trustHost: true,
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
          if (!res.ok) {
            const body = await res.text();
            console.error("Credentials login failed:", {
              status: res.status,
              url: `${API_BASE_URL}/auth/login/`,
              body: body.slice(0, 300),
            });
            return null;
          }
          const data = (await res.json()) as LoginResponse;
          const djangoUser = data.user;
          if (!data.access || !data.refresh || !djangoUser?.id || !djangoUser?.email) {
            console.error("Credentials login returned an invalid payload:", {
              hasAccess: Boolean(data.access),
              hasRefresh: Boolean(data.refresh),
              hasUserId: Boolean(djangoUser?.id),
              hasEmail: Boolean(djangoUser?.email),
            });
            return null;
          }

          const displayName =
            [djangoUser.first_name, djangoUser.last_name].filter(Boolean).join(" ") ||
            djangoUser.username ||
            djangoUser.email;

          return {
            id: String(djangoUser.id),
            email: djangoUser.email,
            name: displayName,
            _at: data.access,
            _rt: data.refresh,
            djangoUser,
          };
        } catch (error) {
          console.error("Credentials login request error:", {
            url: `${API_BASE_URL}/auth/login/`,
            error,
          });
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, account, user }) {
      if (account?.provider === "credentials" && user) {
        const u = user as { id?: string; email?: string; name?: string; _at?: string; _rt?: string; djangoUser?: DjangoUser };
        token.id = u.id;
        token.email = u.email;
        token.name = u.name;
        token._at = u._at;
        token._rt = u._rt;
        if (u.djangoUser) {
          token.djangoUser = u.djangoUser;
        }
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

            console.log("[DEBUG] Calling Django Google auth:", {
              url: `${API_BASE_URL}/auth/social/google/`,
              keys: Object.keys(requestBody),
            });

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

            console.log("[DEBUG] Django social auth response:", {
              status: res.status,
              url: res.url,
              body: responseText.slice(0, 300),
            });

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
        const djangoUser = token.djangoUser as DjangoUser;
        session.user = {
          ...session.user,
          ...djangoUser,
          id: String(djangoUser.id),
          email: djangoUser.email || session.user.email,
          name:
            [djangoUser.first_name, djangoUser.last_name].filter(Boolean).join(" ") ||
            djangoUser.username ||
            session.user.name,
        };
      }
      return session;
    },
  },
});
