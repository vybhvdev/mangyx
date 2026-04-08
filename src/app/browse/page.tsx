import { cookies } from 'next/headers'
import { getMangaTags, searchManga as mdSearch, getInternationalManga } from '@/lib/mangadex'
import { searchManga as consumetSearch } from '@/lib/consumet'
import { BrowseClient } from './BrowseClient'
import { MangaCard } from '@/components/ui/MangaCard'
import { UnifiedMangaCard } from '@/components/ui/UnifiedMangaCard'
import type { UnifiedManga } from '@/lib/manga'

interface Props { searchParams: { q?: string; lang?: string; tag?: string } }

export default async function BrowsePage({ searchParams }: Props) {
  const cookieStore = cookies()
  const provider = cookieStore.get('provider')?.value ?? 'mangadex'
  const q = searchParams.q ?? ''
  const lang = searchParams.lang ?? ''
  const tag = searchParams.tag ?? ''

  // International mode — always MangaDex
  if (lang === 'international') {
    const manga = await getInternationalManga(48)
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="mb-16 animate-fade-up">
          <span className="inline-block mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-text-muted">Global Archive</span>
          <h1 className="font-syne font-black text-4xl md:text-7xl text-foreground tracking-tight uppercase">International</h1>
          <p className="font-cormorant text-xl text-text-muted italic mt-2">Popular titles in their original Japanese, Korean, and Chinese editions.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
          {manga.map((m) => <MangaCard key={m.id} manga={m} showLangBadge />)}
        </div>
      </div>
    )
  }

  // Mangapill provider
  if (provider === 'mangapill') {
    const query = q.trim() || 'manga'
    const raw = await consumetSearch(query).catch(() => [])
    const results: UnifiedManga[] = raw.map((m) => ({
      id: m.id, source: 'consumet' as const,
      title: m.title, coverUrl: m.image,
      description: '', status: '', tags: [],
    }))

    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="mb-16 animate-fade-up">
          <span className="inline-block mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-text-muted">MangaPill Selection</span>
          <h1 className="font-syne font-black text-4xl md:text-7xl text-foreground tracking-tight uppercase">
            {q ? `Query: ${q}` : 'Browse Archive'}
          </h1>
        </div>
        <BrowseClient tags={[]} />
        {results.length === 0 ? (
          <div className="p-20 text-center border border-dashed border-border mt-8">
            <p className="text-text-muted font-bold text-[10px] uppercase tracking-widest">No results matching your query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8 mt-12">
            {results.map((m) => <UnifiedMangaCard key={m.id} manga={m} />)}
          </div>
        )}
      </div>
    )
  }

  // MangaDex (default)
  const tags = await getMangaTags()
  const manga = await mdSearch(q, 24, 'en', tag ? [tag] : []).catch(() => [])

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="mb-16 animate-fade-up">
        <span className="inline-block mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-text-muted">MangaDex Catalog</span>
        <h1 className="font-syne font-black text-4xl md:text-7xl text-foreground tracking-tight uppercase">
          {q ? `Query: ${q}` : 'Library Search'}
        </h1>
      </div>
      <BrowseClient tags={tags} />
      {manga.length === 0 ? (
        <div className="p-20 text-center border border-dashed border-border mt-8">
          <p className="text-text-muted font-bold text-[10px] uppercase tracking-widest">No series found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8 mt-12">
          {manga.map((m) => <MangaCard key={m.id} manga={m} />)}
        </div>
      )}
    </div>
  )
}
