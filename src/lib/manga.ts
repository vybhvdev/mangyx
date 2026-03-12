import * as MangaDex from './mangadex'
import * as Consumet from './consumet'
import type { ConsumetSearchResult } from '@/types'

export type MangaSource = 'mangadex' | 'consumet'

export interface UnifiedManga {
  id: string
  source: MangaSource
  title: string
  coverUrl: string
  description: string
  status: string
  tags: string[]
}

export interface UnifiedPage {
  url: string
  headers?: Record<string, string>
}

function isDoujinshi(title: string): boolean {
  const lower = title.toLowerCase()
  return lower.includes("dj") || lower.includes("doujin") || lower.includes("fan book") || lower.includes("fanbook") || lower.includes("anthology") || lower.includes("comic anthology")
}

function titleMatchScore(title: string, query: string): number {
  const t = title.toLowerCase()
  const q = query.toLowerCase()
  if (t === q) return 3
  if (t.startsWith(q)) return 2
  if (t.includes(q)) return 1
  return 0
}

export async function searchUnified(query: string): Promise<UnifiedManga[]> {
  const [mdResults, cResults] = await Promise.allSettled([
    MangaDex.searchManga(query, 12),
    query.trim() ? Consumet.searchManga(query) : Promise.resolve([]),
  ])

  const mdManga: UnifiedManga[] = mdResults.status === 'fulfilled'
    ? mdResults.value.map((m) => ({
        id: m.id,
        source: 'mangadex' as MangaSource,
        title: MangaDex.getTitle(m),
        coverUrl: MangaDex.getCoverUrl(m, '256'),
        description: MangaDex.getDescription(m),
        status: m.attributes?.status ?? '',
        tags: m.attributes?.tags?.slice(0, 4).map((t) => t.attributes.name.en) ?? [],
      }))
    : []


  const cManga: UnifiedManga[] = cResults.status === 'fulfilled' && query.trim()
    ? (cResults.value as ConsumetSearchResult[])
        .filter((m) => !isDoujinshi(m.title))
        
        .sort((a, b) => titleMatchScore(b.title, query) - titleMatchScore(a.title, query))
        .slice(0, 6)
        .map((m) => ({
          id: m.id,
          source: 'consumet' as MangaSource,
          title: m.title,
          coverUrl: m.image,
          description: '',
          status: '',
          tags: [],
        }))
    : []

  // Put best Consumet matches at top, rest at bottom
  const topConsumet = cManga.filter((m) => titleMatchScore(m.title, query) >= 2)
  const bottomConsumet = cManga.filter((m) => titleMatchScore(m.title, query) < 2)

  return [...topConsumet, ...mdManga, ...bottomConsumet]
}

export async function getPages(
  chapterId: string,
  source: MangaSource
): Promise<UnifiedPage[]> {
  if (source === 'consumet') {
    const pages = await Consumet.getChapterPages(chapterId)
    return pages.map((p) => ({ url: p.img, headers: p.headerForImage }))
  }
  const atHome = await MangaDex.getChapterPages(chapterId)
  return atHome.chapter.data.map((p) => ({
    url: `${atHome.baseUrl}/data/${atHome.chapter.hash}/${p}`,
  }))
}
