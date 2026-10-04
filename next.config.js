/** @type {import('next').NextConfig} */
const nextConfig = {
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
