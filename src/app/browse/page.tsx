import { cookies } from 'next/headers'
import { getMangaTags, searchManga as mdSearch } from '@/lib/mangadex'
import { searchManga as consumetSearch } from '@/lib/consumet'
import { BrowseClient } from './BrowseClient'
import { UnifiedMangaCard } from '@/components/ui/UnifiedMangaCard'
import { MangaCard } from '@/components/ui/MangaCard'
import type { UnifiedManga } from '@/lib/manga'

interface Props { searchParams: { q?: string } }

export default async function BrowsePage({ searchParams }: Props) {
  const cookieStore = cookies()
  const djMode = cookieStore.get('dj-mode')?.value === '1'
  const provider = cookieStore.get('provider')?.value ?? 'mangadex'
  const q = searchParams.q ?? ''

  const tags = provider === 'mangadex' && !djMode ? await getMangaTags() : []

  if (djMode || provider === 'mangapill') {
    const query = q.trim() || (djMode ? 'doujinshi' : 'manga')
    const raw = await consumetSearch(query).catch(() => [])
    const results: UnifiedManga[] = raw.map((m) => ({
      id: m.id, source: 'consumet' as const,
      title: m.title, coverUrl: m.image,
      description: '', status: '', tags: [],
    }))

    return (
      <div className="max-w-[1200px] mx-auto px-8 py-12">
        <h1 className="font-syne font-black text-[2.5rem] tracking-[-0.02em] mb-6">
          {djMode ? 'Doujinshi' : 'Browse'}
        </h1>
        <BrowseClient tags={[]} />
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-5 mt-8">
          {results.map((m) => <UnifiedMangaCard key={m.id} manga={m} />)}
        </div>
      </div>
    )
  }

  // MangaDex
  const manga = q ? await mdSearch(q, 24) : await mdSearch('', 24)
  return (
    <div className="max-w-[1200px] mx-auto px-8 py-12">
      <h1 className="font-syne font-black text-[2.5rem] tracking-[-0.02em] mb-6">Browse</h1>
      <BrowseClient tags={tags} />
      {manga.length === 0 ? (
        <p className="label-mono mt-12">No results found.</p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-5 mt-8">
          {manga.map((m) => <MangaCard key={m.id} manga={m} />)}
        </div>
      )}
    </div>
  )
}
