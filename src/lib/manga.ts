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

  // Only add Consumet results if there's a search query
  // Show top 6 Consumet results always (even if same title — different source/chapters)
  const cManga: UnifiedManga[] = cResults.status === 'fulfilled' && query.trim()
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

  return [...mdManga, ...cManga]
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
