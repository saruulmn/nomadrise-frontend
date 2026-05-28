import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "https://api.nomadrise.mn/api";
const apiOrigin = (() => {
  try {
    return new URL(apiUrl).origin;
  } catch {
    return "https://api.nomadrise.mn";
  }
})();

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com; connect-src 'self' ${apiOrigin} https://accounts.google.com https://www.facebook.com https://appleid.apple.com https://cloudflareinsights.com https://static.cloudflareinsights.com; img-src 'self' ${apiOrigin} data: blob: https:; style-src 'self' 'unsafe-inline';`,
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.nomadrise.mn',
          },
        ],
        destination: 'https://nomadrise.mn/:path*',
        permanent: true,
      },
      // Redirect root to default locale
      {
        source: '/',
        destination: '/mn',
        permanent: false,
      },
      // Redirect dashboard without locale to default locale
      {
        source: '/dashboard',
        destination: '/mn/dashboard',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
