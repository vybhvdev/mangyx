import { MetadataRoute } from 'next'
import { getPopularManga, getRecentlyUpdated } from '@/lib/mangadex'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://mangyx.vercel.app'

  const [popular, recent] = await Promise.all([
    getPopularManga(24).catch(() => []),
    getRecentlyUpdated(24).catch(() => []),
  ])

  // Dedupe
  const seen = new Set<string>()
  const manga = [...popular, ...recent].filter((m) => {
    if (seen.has(m.id)) return false
    seen.add(m.id)
    return true
  })

  const mangaUrls = manga.map((m) => ({
    url: `${base}/manga/${m.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${base}/browse`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/info`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    ...mangaUrls,
  ]
}
