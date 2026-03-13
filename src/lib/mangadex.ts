import type { Manga, Chapter, MangaDexListResponse, AtHomeResponse } from '@/types'

const BASE = 'https://api.mangadex.org'

async function get<T>(path: string, params: Record<string, string | string[]> = {}): Promise<T> {
  const url = new URL(BASE + path)
  for (const [k, v] of Object.entries(params)) {
    if (Array.isArray(v)) v.forEach((val) => url.searchParams.append(k, val))
    else url.searchParams.set(k, v)
  }
  const res = await fetch(url.toString(), { next: { revalidate: 300 } })
  if (!res.ok) throw new Error(`MangaDex ${res.status}: ${path}`)
  return res.json()
}

export function getCoverUrl(manga: Manga, size: '256' | '512' | '' = '256'): string {
  const rel = manga.relationships?.find((r) => r.type === 'cover_art')
  const file = rel?.attributes?.fileName
  if (!file) return ''
  const suffix = size ? `.${size}.jpg` : ''
  return `https://uploads.mangadex.org/covers/${manga.id}/${file}${suffix}`
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

export async function getPopularManga(limit = 12): Promise<Manga[]> {
  const d = await get<MangaDexListResponse<Manga>>('/manga', {
    limit: String(limit * 2),
    'includes[]': ['cover_art'],
    'contentRating[]': ['safe', 'suggestive'],
    'availableTranslatedLanguage[]': ['en'],
    'hasAvailableChapters': 'true',
    'order[followedCount]': 'desc',
  })
  // Filter out manga with no English chapters (lastChapter is null for non-English)
  const filtered = d.data.filter((m) => {
    const lastVol = m.attributes?.lastVolume
    const lastCh = m.attributes?.lastChapter
    const lang = m.attributes?.originalLanguage
    // If originally English, always include
    if (lang === 'en') return true
    // Otherwise must have lastChapter data indicating translation exists
    return m.attributes?.availableTranslatedLanguages?.includes('en') ?? false
  })
  return filtered.slice(0, limit)
}

export async function getRecentlyUpdated(limit = 16): Promise<Manga[]> {
  const d = await get<MangaDexListResponse<Manga>>('/manga', {
    limit: String(limit * 2),
    'includes[]': ['cover_art'],
    'contentRating[]': ['safe', 'suggestive'],
    'availableTranslatedLanguage[]': ['en'],
    'hasAvailableChapters': 'true',
    'order[latestUploadedChapter]': 'desc',
  })
  const filtered = d.data.filter((m) =>
    m.attributes?.originalLanguage === 'en' ||
    (m.attributes?.availableTranslatedLanguages?.includes('en') ?? false)
  )
  return filtered.slice(0, limit)
}

export async function searchManga(query: string, limit = 24): Promise<Manga[]> {
  const params: Record<string, string | string[]> = {
    limit: String(limit),
    'includes[]': ['cover_art'],
    'contentRating[]': ['safe', 'suggestive'],
    'availableTranslatedLanguage[]': ['en'],
  }
  if (query.trim()) {
    params.title = query.trim()
    params['order[relevance]'] = 'desc'
  } else {
    params['order[followedCount]'] = 'desc'
  }
  const d = await get<MangaDexListResponse<Manga>>('/manga', params)
  return d.data
}

export async function getMangaById(id: string): Promise<Manga> {
  const d = await get<{ data: Manga }>(`/manga/${id}`, { 'includes[]': ['cover_art'] })
  return d.data
}

export async function getMangaFeed(
  mangaId: string,
  limit = 40,
  offset = 0
): Promise<{ chapters: Chapter[]; total: number }> {
  const d = await get<MangaDexListResponse<Chapter>>(`/manga/${mangaId}/feed`, {
    limit: String(limit),
    offset: String(offset),
    'translatedLanguage[]': ['en'],
    'order[chapter]': 'desc',
    'includes[]': ['scanlation_group'],
    'contentRating[]': ['safe', 'suggestive'],
  })
  const chapters = d.data.filter(
    (c) => c.attributes.chapter !== null && !c.attributes.externalUrl
  )
  return { chapters, total: d.total }
}

export async function getChapterPages(chapterId: string): Promise<AtHomeResponse> {
  return get<AtHomeResponse>(`/at-home/server/${chapterId}`)
}

export async function getMangaTags(): Promise<{ id: string; name: string }[]> {
  const d = await get<{
    data: { id: string; attributes: { name: { en: string }; group: string } }[]
  }>('/manga/tag')
  return d.data
    .filter((t) => t.attributes.group === 'genre')
    .map((t) => ({ id: t.id, name: t.attributes.name.en }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export async function getRelatedManga(
  mangaId: string,
  tags: string[],
  limit = 6
): Promise<Manga[]> {
  if (tags.length === 0) return getPopularManga(limit)
  const data = await get<MangaDexListResponse<Manga>>('/manga', {
    limit: String(limit + 1),
    'includedTags[]': tags.slice(0, 2),
    'includes[]': ['cover_art'],
    'contentRating[]': ['safe', 'suggestive'],
    'availableTranslatedLanguage[]': ['en'],
    'order[followedCount]': 'desc',
  })
  return data.data.filter((m) => m.id !== mangaId).slice(0, limit)
}
