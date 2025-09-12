/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost', 'api.example.com'],
    dangerouslyAllowSVG: true,
  },
  // Note: PWA features are intentionally disabled in development to avoid caching issues
}

module.exports = nextConfig