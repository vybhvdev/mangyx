import { notFound } from 'next/navigation'
import { getChapterPages, getMangaFeed } from '@/lib/mangadex'
import { ReaderClient } from './ReaderClient'

interface Props {
  params: { chapterId: string }
  searchParams: { manga?: string }
}

export default async function ReaderPage({ params, searchParams }: Props) {
  const [atHome, feedData] = await Promise.all([
    getChapterPages(params.chapterId).catch(() => null),
    searchParams.manga
      ? getMangaFeed(searchParams.manga, 100, 0).catch(() => ({ chapters: [], total: 0 }))
      : Promise.resolve({ chapters: [], total: 0 }),
  ])

  if (!atHome) notFound()

  const pages = atHome.chapter.data.map(
    (p) => `${atHome.baseUrl}/data/${atHome.chapter.hash}/${p}`
  )

  const chapters = feedData.chapters
  const currentIndex = chapters.findIndex((c) => c.id === params.chapterId)

  return (
    <ReaderClient
      pages={pages}
      chapterId={params.chapterId}
      mangaId={searchParams.manga ?? ''}
      chapters={chapters.map((c) => ({ id: c.id, num: c.attributes.chapter ?? '?' }))}
      currentIndex={currentIndex}
    />
  )
}
