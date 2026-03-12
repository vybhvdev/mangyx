/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'uploads.mangadex.org', pathname: '/covers/**' }],
  },
}
module.exports = nextConfig
