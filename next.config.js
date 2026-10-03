/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = nextConfig;

// Makes the Cloudflare bindings (the D1 database) available to `next dev`.
if (process.env.NODE_ENV === 'development') import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
