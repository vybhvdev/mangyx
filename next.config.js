const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  swcMinify: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'uploads.mangadex.org', pathname: '/covers/**' },
      { protocol: 'https', hostname: 'cdn.readdetectiveconan.com' },
      { protocol: 'https', hostname: '**.mangapill.com' },
      { protocol: 'https', hostname: '**.cdnpic.net' },
    ],
  },
}
module.exports = nextConfig
