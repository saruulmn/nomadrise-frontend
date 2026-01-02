import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
