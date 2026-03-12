import type { Manga, Chapter, MangaDexListResponse, AtHomeResponse } from '@/types'

const BASE = 'https://api.mangadex.org'
const COVER_BASE = 'https://uploads.mangadex.org/covers'
const PROXY = 'https://corsproxy.io/?'

export function getCoverUrl(manga: Manga, size: '256' | '512' | '' = '256'): string {
  const rel = manga.relationships?.find((r) => r.type === 'cover_art')
  if (!rel?.attributes?.fileName) return ''
  return `${COVER_BASE}/${manga.id}/${rel.attributes.fileName}${size ? `.${size}.jpg` : ''}`
}
export function getTitle(manga: Manga): string {
  const t = manga.attributes?.title
  return t?.en ?? t?.['ja-ro'] ?? t?.ja ?? Object.values(t ?? {})[0] ?? 'Untitled'
}
export function getDescription(manga: Manga): string {
  const d = manga.attributes?.description
  return d?.en ?? Object.values(d ?? {})[0] ?? ''
}
export function getScanlationGroup(chapter: Chapter): string {
  const rel = chapter.relationships?.find((r) => r.type === 'scanlation_group')
  return rel?.attributes?.name ?? ''
}

async function get<T>(path: string, params: Record<string, string | string[]> = {}): Promise<T> {
  const url = new URL(BASE + path)
  Object.entries(params).forEach(([k, v]) => {
    if (Array.isArray(v)) v.forEach((x) => url.searchParams.append(k, x))
    else url.searchParams.set(k, v)
  })
  const direct = url.toString()
  for (const u of [direct, PROXY + encodeURIComponent(direct)]) {
    try {
      const res = await fetch(u, { next: { revalidate: 300 }, signal: AbortSignal.timeout(12000) })
      if (res.ok) return res.json() as Promise<T>
    } catch { /* try next */ }
  }
  throw new Error(`MangaDex unreachable: ${path}`)
}

export async function getPopularManga(limit = 12): Promise<Manga[]> {
  const d = await get<MangaDexListResponse<Manga>>('/manga', { limit: String(limit), 'order[followedCount]': 'desc', 'includes[]': ['cover_art'], 'contentRating[]': ['safe', 'suggestive'], 'availableTranslatedLanguage[]': ['en'] })
  return d.data
}
export async function getRecentlyUpdated(limit = 16): Promise<Manga[]> {
  const d = await get<MangaDexListResponse<Manga>>('/manga', { limit: String(limit), 'order[latestUploadedChapter]': 'desc', 'includes[]': ['cover_art'], 'contentRating[]': ['safe', 'suggestive'], 'availableTranslatedLanguage[]': ['en'] })
  return d.data
}
export async function searchManga(query: string, limit = 24, offset = 0, tagIds: string[] = []): Promise<{ data: Manga[]; total: number }> {
  const params: Record<string, string | string[]> = { limit: String(limit), offset: String(offset), 'includes[]': ['cover_art'], 'contentRating[]': ['safe', 'suggestive'], 'availableTranslatedLanguage[]': ['en'], 'order[followedCount]': 'desc' }
  if (query) params.title = query
  if (tagIds.length > 0) params['includedTags[]'] = tagIds
  const d = await get<MangaDexListResponse<Manga>>('/manga', params)
  return { data: d.data, total: d.total }
}
export async function getMangaById(id: string): Promise<Manga> {
  const d = await get<{ data: Manga }>(`/manga/${id}`, { 'includes[]': ['cover_art'] })
  return d.data
}
export async function getMangaFeed(mangaId: string, limit = 40, offset = 0): Promise<{ chapters: Chapter[]; total: number }> {
  const d = await get<MangaDexListResponse<Chapter>>(`/manga/${mangaId}/feed`, { limit: String(limit), offset: String(offset), 'translatedLanguage[]': ['en'], 'order[chapter]': 'desc', 'includes[]': ['scanlation_group'], 'contentRating[]': ['safe', 'suggestive'] })
  return { chapters: d.data.filter((c) => c.attributes.chapter !== null), total: d.total }
}
export async function getChapterPages(chapterId: string): Promise<AtHomeResponse> {
  return get<AtHomeResponse>(`/at-home/server/${chapterId}`)
}
export async function getMangaTags(): Promise<{ id: string; name: string }[]> {
  const d = await get<{ data: { id: string; attributes: { name: { en: string }; group: string } }[] }>('/manga/tag')
  return d.data.filter((t) => t.attributes.group === 'genre').map((t) => ({ id: t.id, name: t.attributes.name.en })).sort((a, b) => a.name.localeCompare(b.name))
}
