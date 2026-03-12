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
  // raw data for source-specific pages
  raw?: unknown
}

export interface UnifiedChapter {
  id: string
  source: MangaSource
  mangaId: string
  number: string
  title: string
  date?: string
}

export interface UnifiedPage {
  url: string
  headers?: Record<string, string>
}

// Search both sources, MangaDex first
export async function searchUnified(query: string): Promise<UnifiedManga[]> {
  const [mdResults, cResults] = await Promise.allSettled([
    MangaDex.searchManga(query, 18),
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

  const cManga: UnifiedManga[] = cResults.status === 'fulfilled'
    ? (cResults.value as ConsumetSearchResult[])
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

  // Deduplicate by title (avoid showing same manga twice)
  const mdTitles = new Set(mdManga.map((m) => m.title.toLowerCase()))
  const uniqueConsumet = cManga.filter((m) => !mdTitles.has(m.title.toLowerCase()))

  return [...mdManga, ...uniqueConsumet]
}

// Get chapter pages from either source
export async function getPages(
  chapterId: string,
  source: MangaSource
): Promise<UnifiedPage[]> {
  if (source === 'consumet') {
    const pages = await Consumet.getChapterPages(chapterId)
    return pages.map((p) => ({ url: p.img, headers: p.headerForImage }))
  }

  // MangaDex
  const atHome = await MangaDex.getChapterPages(chapterId)
  return atHome.chapter.data.map((p) => ({
    url: `${atHome.baseUrl}/data/${atHome.chapter.hash}/${p}`,
  }))
}
