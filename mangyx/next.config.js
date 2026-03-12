/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable SWC — it has no Android arm64 binary.
  // Babel is used instead (pure JS, works on Termux).
  experimental: {
    forceSwcTransforms: false,
  },
  swcMinify: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uploads.mangadex.org',
        pathname: '/covers/**',
      },
    ],
  },
}

module.exports = nextConfig
