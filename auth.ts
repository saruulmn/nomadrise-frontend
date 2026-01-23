import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { syncOAuthUser } from "./lib/api";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // On initial sign in, attach provider info
      if (account && user) {
        token.provider = account.provider;
        token.providerAccountId = account.providerAccountId;
        token.accessToken = account.access_token;
        
        // Sync user to Django backend using centralized API
        try {
          const result = await syncOAuthUser({
            email: user.email,
            name: user.name,
            image: user.image,
            provider: account.provider,
            provider_account_id: account.providerAccountId || '',
          });
          token.backendUserId = result.user_id;
        } catch (error) {
          console.error('Failed to sync user to backend:', error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Expose user info to frontend
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.provider = token.provider as string;
        session.user.providerAccountId = token.providerAccountId as string;
        session.user.backendUserId = token.backendUserId as number;
      }
      return session;
    },
  },
});
