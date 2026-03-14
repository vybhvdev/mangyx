import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getMangaById, getMangaFeed, getCoverUrl, getTitle } from '@/lib/mangadex'
import { getPages } from '@/lib/manga'
import { ReaderClient } from './ReaderClient'
import type { MangaSource } from '@/lib/manga'

interface Props {
  params: { chapterId: string }
  searchParams: { manga?: string; source?: string }
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  return {
    title: `Reading Chapter — Mangyx`,
    robots: { index: false },
  }
}

export default async function ReaderPage({ params, searchParams }: Props) {
  const source = (searchParams.source ?? 'mangadex') as MangaSource
  const mangaId = searchParams.manga ?? ''
  const chapterId = decodeURIComponent(params.chapterId)

  const [pages, feedData, manga] = await Promise.all([
    getPages(chapterId, source).catch(() => []),
    source === 'mangadex' && mangaId
      ? getMangaFeed(mangaId, 100, 0).catch(() => ({ chapters: [], total: 0 }))
      : Promise.resolve({ chapters: [], total: 0 }),
    source === 'mangadex' && mangaId
      ? getMangaById(mangaId).catch(() => null)
      : Promise.resolve(null),
  ])

  const mangaTitle = manga ? getTitle(manga) : ''
  const coverUrl = manga ? getCoverUrl(manga, '256') : ''

  const chapters = feedData.chapters
  const currentIndex = chapters.findIndex((c) => c.id === chapterId)

  return (
    <ReaderClient
      pages={pages.map((p) => p.url)}
      pageHeaders={pages.map((p) => p.headers ?? {})}
      chapterId={chapterId}
      mangaId={mangaId}
      mangaTitle={mangaTitle}
      coverUrl={coverUrl}
      source={source}
      chapters={chapters.map((c) => ({ id: c.id, num: c.attributes.chapter ?? '?' }))}
      currentIndex={currentIndex}
    />
  )
}
