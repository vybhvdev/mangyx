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
        <div className="mb-12 animate-fade-up">
          <span className="inline-block px-3 py-1 bg-accent/20 text-accent rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
            Global Collection
          </span>
          <h1 className="font-syne font-black text-4xl md:text-6xl text-white mb-4 tracking-tight">International</h1>
          <p className="text-text-muted text-sm md:text-base max-w-lg">Popular titles in their original Japanese, Korean, and Chinese editions.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
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
        <div className="mb-12 animate-fade-up">
          <span className="inline-block px-3 py-1 bg-white/5 text-white/60 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10 mb-4">
            Mangapill Provider
          </span>
          <h1 className="font-syne font-black text-4xl md:text-6xl text-white mb-4 tracking-tight">
            {q ? `Results for "${q}"` : 'Discover Manga'}
          </h1>
        </div>
        <BrowseClient tags={[]} />
        {results.length === 0 ? (
          <div className="p-20 text-center bg-surface/30 rounded-3xl border border-dashed border-white/5 mt-8">
            <p className="text-text-muted font-bold text-sm uppercase tracking-widest">No results found for your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 mt-12">
            {results.map((m) => <UnifiedMangaCard key={m.id} manga={m} />)}
          </div>
        )}
      </div>
    )
  }

  // MangaDex (default)
  const tags = await getMangaTags()
  const manga = await mdSearch(q, 24).catch(() => [])

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="mb-12 animate-fade-up">
        <span className="inline-block px-3 py-1 bg-white/5 text-white/60 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10 mb-4">
          MangaDex Provider
        </span>
        <h1 className="font-syne font-black text-4xl md:text-6xl text-white mb-4 tracking-tight">
          {q ? `Results for "${q}"` : 'Library Explorer'}
        </h1>
      </div>
      <BrowseClient tags={tags} />
      {manga.length === 0 ? (
        <div className="p-20 text-center bg-surface/30 rounded-3xl border border-dashed border-white/5 mt-8">
          <p className="text-text-muted font-bold text-sm uppercase tracking-widest">No series found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 mt-12">
          {manga.map((m) => <MangaCard key={m.id} manga={m} />)}
        </div>
      )}
    </div>
  )
}
