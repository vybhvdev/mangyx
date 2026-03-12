import type { ConsumetManga, ConsumetSearchResult, ConsumetChapterPage } from '@/types'

const BASE = 'https://private-consumet-api.vercel.app/manga/mangapill'

async function fetcher<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error(`Consumet ${res.status}: ${path}`)
  return res.json()
}

export async function searchManga(query: string): Promise<ConsumetSearchResult[]> {
  const data = await fetcher<{ results: ConsumetSearchResult[] }>(`/${encodeURIComponent(query)}`)
  return data.results ?? []
}

export async function getMangaInfo(mangaId: string): Promise<ConsumetManga> {
  return fetcher<ConsumetManga>(`/info?id=${encodeURIComponent(mangaId)}`)
}

export async function getChapterPages(chapterId: string): Promise<ConsumetChapterPage[]> {
  const data = await fetcher<ConsumetChapterPage[] | { pages: ConsumetChapterPage[] }>(
    `/read?chapterId=${encodeURIComponent(chapterId)}`
  )
  return Array.isArray(data) ? data : data.pages ?? []
}
