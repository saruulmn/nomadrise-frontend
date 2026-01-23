import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' https://api.nomadrise.mn https://accounts.google.com https://www.facebook.com https://appleid.apple.com; style-src 'self' 'unsafe-inline';",
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
