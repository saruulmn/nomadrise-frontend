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
        
        // Only sync if not already synced
        if (!token.backendUserId) {
          // Retry up to 3 times with exponential backoff
          for (let attempt = 1; attempt <= 3; attempt++) {
            try {
              const result = await syncOAuthUser({
                email: user.email || '',
                name: user.name || '',
                image: user.image || '',
                provider: account.provider,
                provider_account_id: account.providerAccountId || '',
              });
              token.backendUserId = result.user_id;
              break; // Success, exit retry loop
            } catch (error) {
              if (attempt === 3) {
                console.error('Failed to sync user after 3 retries:', error);
              } else {
                // Wait before retrying: 1s, 2s, 4s exponential backoff
                await new Promise(resolve => 
                  setTimeout(resolve, Math.pow(2, attempt - 1) * 1000)
                );
              }
            }
          }
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
