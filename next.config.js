/** @type {import('next').NextConfig} */
const nextConfig = {
  // Basic protections on every page: HTTPS only, no guessing of file types, no embedding in other sites, less referrer data.
  async headers() {
    return [{ source: '/:path*', headers: [
      { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'Content-Security-Policy', value: "frame-ancestors 'self'" },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
    ] }];
  },
  // www.mathsetu.in is sent to mathsetu.in, so there is one address for logins and for search engines.
  async redirects() {
    return [
      { source: '/', has: [{ type: 'host', value: 'www.mathsetu.in' }], destination: 'https://mathsetu.in/', permanent: true },
      { source: '/:path*', has: [{ type: 'host', value: 'www.mathsetu.in' }], destination: 'https://mathsetu.in/:path*', permanent: true },
    ];
  },
};

module.exports = nextConfig;

// Makes the Cloudflare bindings (the D1 database) available to `next dev`.
if (process.env.NODE_ENV === 'development') import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
