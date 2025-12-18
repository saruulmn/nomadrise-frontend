# Auth.js Login Setup Guide

This guide will help you set up Google, Facebook, and Apple authentication for your NomadRise application.

## Prerequisites

- Node.js installed
- A Google Cloud Console account
- A Facebook Developer account
- An Apple Developer account

## Installation

The required dependencies have already been installed:
- `next-auth@beta` (Auth.js v5 for Next.js 16)

## Environment Variables

Copy the `.env.local` file and update it with your actual credentials:

```bash
# Generate a secret key (run this in terminal):
openssl rand -base64 32
```

Then update the following variables in `.env.local`:

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
7. Copy the Client ID and Client Secret to `.env.local`:
   - `AUTH_GOOGLE_ID=your-google-client-id`
   - `AUTH_GOOGLE_SECRET=your-google-client-secret`

### Facebook OAuth Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or select an existing one
3. Add "Facebook Login" product
4. In Facebook Login settings, add Valid OAuth Redirect URIs:
   - `http://localhost:3000/api/auth/callback/facebook` (for development)
   - `https://yourdomain.com/api/auth/callback/facebook` (for production)
5. Get your App ID and App Secret from Settings → Basic
6. Update `.env.local`:
   - `AUTH_FACEBOOK_ID=your-facebook-app-id`
   - `AUTH_FACEBOOK_SECRET=your-facebook-app-secret`

### Apple OAuth Setup

Apple authentication is more complex and requires:

1. An Apple Developer account ($99/year)
2. Go to [Apple Developer](https://developer.apple.com/)
3. Create an App ID:
   - Go to Certificates, Identifiers & Profiles
   - Create a new App ID
   - Enable "Sign in with Apple"
4. Create a Service ID:
   - Create a new Services ID
   - Enable "Sign in with Apple"
   - Configure domains and redirect URLs:
     - Domain: `localhost` (for development) or `yourdomain.com`
     - Redirect URL: `http://localhost:3000/api/auth/callback/apple` or `https://yourdomain.com/api/auth/callback/apple`
5. Create a Private Key:
   - Go to Keys
   - Create a new key with "Sign in with Apple" enabled
   - Download the key file (you can only download it once!)
6. Generate a client secret using the Apple Sign In generator or create one programmatically
7. Update `.env.local`:
   - `AUTH_APPLE_ID=your-service-id` (Service ID, not App ID)
   - `AUTH_APPLE_SECRET=your-apple-client-secret` (Generated client secret JWT)

**Note:** For local development, Apple authentication may not work as Apple requires HTTPS. Consider using ngrok or testing on a deployed environment.

## Running the Application

```bash
cd frontend
npm run dev
```

Visit:
- Login page: http://localhost:3000/login
- Dashboard: http://localhost:3000/dashboard (requires authentication)

## File Structure

```
frontend/
├── auth.ts                          # Main Auth.js configuration
├── auth.config.ts                   # Auth.js providers and callbacks
├── middleware.ts                    # Route protection middleware
├── .env.local                       # Environment variables (DO NOT COMMIT)
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts         # Auth.js API routes
│   ├── login/
│   │   ├── page.tsx                 # Login page with social buttons
│   │   └── layout.tsx               # Login layout
│   ├── dashboard/
│   │   └── page.tsx                 # Protected dashboard page
│   └── components/
│       ├── AuthProvider.tsx         # Session provider wrapper
│       ├── UserProfile.tsx          # User profile dropdown
│       └── NavBar.tsx               # Updated navbar with auth
```

## Features

✅ **Social Authentication**
- Google Sign In
- Facebook Sign In
- Apple Sign In

✅ **Route Protection**
- Dashboard requires authentication
- Automatic redirect to login for unauthenticated users
- Middleware-based protection

✅ **User Interface**
- Beautiful login page with Ant Design
- User profile dropdown in navbar
- Sign out functionality

✅ **Session Management**
- JWT-based sessions
- Persistent authentication
- Automatic session refresh

## Testing

1. Click "Sign In" in the navbar or go to `/login`
2. Choose a provider (Google, Facebook, or Apple)
3. Complete the OAuth flow
4. You'll be redirected to `/dashboard`
5. Your profile picture and name appear in the navbar
6. Click on your profile to access dashboard or sign out

## Production Deployment

Before deploying to production:

1. Update `NEXTAUTH_URL` in `.env.local` to your production URL
2. Add production callback URLs to each OAuth provider:
   - Google: `https://yourdomain.com/api/auth/callback/google`
   - Facebook: `https://yourdomain.com/api/auth/callback/facebook`
   - Apple: `https://yourdomain.com/api/auth/callback/apple`
3. Ensure all environment variables are set in your hosting platform
4. Test each provider thoroughly

## Troubleshooting

### Google OAuth Issues
- Ensure "Google+ API" is enabled
- Check redirect URIs match exactly (including http/https)
- Verify OAuth consent screen is configured

### Facebook OAuth Issues
- App must be in "Live" mode for production
- Check "Valid OAuth Redirect URIs" in Facebook Login settings
- Verify App ID and Secret are correct

### Apple OAuth Issues
- Apple authentication requires HTTPS in production
- Verify Service ID (not App ID) is used
- Private key must include the full PEM format with line breaks
- Check domain verification in Apple Developer portal

## Security Notes

- Never commit `.env.local` to version control
- Rotate `AUTH_SECRET` regularly
- Use HTTPS in production
- Review OAuth callback URLs carefully
- Keep provider credentials secure

## Additional Resources

- [Auth.js Documentation](https://authjs.dev/)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login/)
- [Apple Sign In Documentation](https://developer.apple.com/sign-in-with-apple/)
