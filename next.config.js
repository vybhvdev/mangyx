const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  swcMinify: false,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'uploads.mangadex.org', pathname: '/covers/**' }],
  },
}
module.exports = nextConfig
