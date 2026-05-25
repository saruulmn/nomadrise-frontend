/** @type {import('next').NextConfig} */
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.nomadrise.mn/api";
const apiOrigin = (() => {
  try {
    return new URL(apiUrl).origin;
  } catch {
    return "https://api.nomadrise.mn";
  }
})();

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Content-Security-Policy", value: `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' ${apiOrigin} https://accounts.google.com https://www.facebook.com https://appleid.apple.com; img-src 'self' ${apiOrigin} data: blob: https:; style-src 'self' 'unsafe-inline';` },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
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
      {
        source: '/',
        destination: '/mn',
        permanent: false,
      },
      {
        source: '/dashboard',
        destination: '/mn/dashboard',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
