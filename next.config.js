/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost', 'api.example.com'],
    dangerouslyAllowSVG: true,
  },
  // PWA configuration will be added via next-pwa wrapper
}

module.exports = nextConfig