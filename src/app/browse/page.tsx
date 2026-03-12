import { cookies } from 'next/headers'
import { searchUnified } from '@/lib/manga'
import { getMangaTags } from '@/lib/mangadex'
import { BrowseClient } from './BrowseClient'
import { UnifiedMangaCard } from '@/components/ui/UnifiedMangaCard'
import { searchManga as consumetSearch } from '@/lib/consumet'
import type { UnifiedManga } from '@/lib/manga'

interface Props {
  searchParams: { q?: string; tag?: string }
}

export default async function BrowsePage({ searchParams }: Props) {
  const cookieStore = cookies()
  const djMode = cookieStore.get('dj-mode')?.value === '1'
  const q = searchParams.q ?? ''

  const tags = await getMangaTags()

  let results: UnifiedManga[] = []

  if (djMode) {
    const query = q.trim() || 'doujinshi'
    const raw = await consumetSearch(query).catch(() => [])
    results = raw.map((m) => ({
      id: m.id,
      source: 'consumet' as const,
      title: m.title,
      coverUrl: m.image,
      description: '',
      status: '',
      tags: [],
    }))
  } else {
    results = await searchUnified(q)
  }

  return (
    <div className="max-w-[1200px] mx-auto px-8 py-12">
      <h1 className="font-syne font-black text-[2.5rem] tracking-[-0.02em] mb-6">
        {djMode ? 'Doujinshi' : 'Browse'}
      </h1>
      <BrowseClient tags={djMode ? [] : tags} />
      {results.length === 0 ? (
        <p className="label-mono mt-12">No results found.</p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-5 mt-8">
          {results.map((m) => <UnifiedMangaCard key={`${m.source}-${m.id}`} manga={m} />)}
        </div>
      )}
    </div>
  )
}
