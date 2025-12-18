import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Redirect dashboard without auth to login (handled by client-side)
      {
        source: '/dashboard',
        destination: '/mn/login',
        permanent: false,
      },
    ];
  },
  
  async rewrites() {
    return {
      beforeFiles: [
        // Rewrite root path to default locale
        {
          source: '/',
          destination: '/mn',
        },
        // Rewrite paths without locale to default locale
        {
          source: '/:path((?!en|mn|api|_next|images|favicon.ico).*)',
          destination: '/mn/:path*',
        },
      ],
    };
  },
};

export default nextConfig;
