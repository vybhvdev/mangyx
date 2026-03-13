import { cookies } from 'next/headers'
import { getPopularManga, getRecentlyUpdated } from '@/lib/mangadex'
import { searchManga as consumetSearch } from '@/lib/consumet'
import { MangaCard } from '@/components/ui/MangaCard'
import { UnifiedMangaCard } from '@/components/ui/UnifiedMangaCard'
import type { UnifiedManga } from '@/lib/manga'

function toUnified(results: Awaited<ReturnType<typeof consumetSearch>>): UnifiedManga[] {
  return results.slice(0, 12).map((m) => ({
    id: m.id, source: 'consumet' as const,
    title: m.title, coverUrl: m.image,
    description: '', status: '', tags: [],
  }))
}

export default async function HomePage() {
  const cookieStore = cookies()
  const djMode = cookieStore.get('dj-mode')?.value === '1'
  const provider = cookieStore.get('provider')?.value ?? 'mangadex'

  if (djMode) {
    const [a, b, c] = await Promise.all([
      consumetSearch('action doujinshi').catch(() => []),
      consumetSearch('romance doujinshi').catch(() => []),
      consumetSearch('popular doujinshi').catch(() => []),
    ])
    return (
      <div className="max-w-[1200px] mx-auto px-8">
        <section className="py-16 border-b border-ink-200 mb-12">
          <p className="font-mono text-[0.7rem] tracking-[0.3em] uppercase text-[#b44fff] mb-4">● DJ Mode Active</p>
          <h1 className="font-syne font-black text-[clamp(3rem,8vw,7rem)] leading-[0.9] tracking-[-0.03em] mb-6">
            Doujinshi<br />Reader
          </h1>
          <p className="font-cormorant text-[1.2rem] text-ink-600 max-w-md">
            Fan-made works, alternate universes, and independent stories.
          </p>
        </section>
        {[['Action', a], ['Romance', b], ['Popular', c]].map(([label, results]) => (
          <section key={label as string} className="mb-12">
            <h2 className="font-syne font-bold text-[1.3rem] mb-6">{label as string}</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-5">
              {toUnified(results as Awaited<ReturnType<typeof consumetSearch>>).map((m) => (
                <UnifiedMangaCard key={m.id} manga={m} />
              ))}
            </div>
          </section>
        ))}
      </div>
    )
  }

  if (provider === 'mangapill') {
    const [popular, recent] = await Promise.all([
      consumetSearch('popular manga').catch(() => []),
      consumetSearch('action manga').catch(() => []),
    ])
    return (
      <div className="max-w-[1200px] mx-auto px-8">
        <section className="py-12 border-b border-ink-200 mb-12">
          <p className="font-mono text-[0.7rem] tracking-[0.25em] uppercase text-ink-400 mb-3">Mangapill</p>
          <h1 className="font-syne font-black text-[clamp(3rem,7vw,6rem)] leading-[0.95] tracking-[-0.02em] text-onyx mb-4">
            Read Manga
          </h1>
          <p className="font-cormorant text-[1.1rem] text-ink-600 max-w-md">
            Wide selection of manga and fan works from Mangapill.
          </p>
        </section>
        <section className="mb-12">
          <h2 className="font-syne font-bold text-[1.3rem] mb-6">Popular</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-5">
            {toUnified(popular).map((m) => <UnifiedMangaCard key={m.id} manga={m} />)}
          </div>
        </section>
        <section className="mb-12">
          <h2 className="font-syne font-bold text-[1.3rem] mb-6">Action</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-5">
            {toUnified(recent).map((m) => <UnifiedMangaCard key={m.id} manga={m} />)}
          </div>
        </section>
      </div>
    )
  }

  // Default: MangaDex
  const [popular, recent] = await Promise.all([
    getPopularManga(12),
    getRecentlyUpdated(16),
  ])
  const featured = popular[0]

  return (
    <div className="max-w-[1200px] mx-auto px-8">
      {featured && (
        <section className="py-12 border-b border-ink-200 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-8 items-end">
            <div>
              <p className="font-mono text-[0.7rem] tracking-[0.25em] uppercase text-ink-400 mb-3">Featured Today</p>
              <h1 className="font-syne font-black text-[clamp(3rem,7vw,6rem)] leading-[0.95] tracking-[-0.02em] text-onyx mb-4">
                {featured.attributes?.title?.en ?? 'Featured'}
              </h1>
              <p className="font-cormorant text-[1.1rem] text-ink-600 leading-relaxed max-w-md mb-6 line-clamp-3">
                {featured.attributes?.description?.en ?? ''}
              </p>
              <div className="flex gap-3">
                <a href={`/manga/${featured.id}`} className="btn-primary">Read Now</a>
                <a href={`/manga/${featured.id}`} className="btn-secondary">Bookmark</a>
              </div>
            </div>
          </div>
        </section>
      )}
      <section className="mb-12">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-syne font-bold text-[1.3rem]">Popular</h2>
          <a href="/browse" className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-ink-400 hover:text-onyx transition-colors">View all →</a>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-5">
          {popular.slice(1).map((m) => <MangaCard key={m.id} manga={m} />)}
        </div>
      </section>
      <section className="mb-12">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-syne font-bold text-[1.3rem]">Recently Updated</h2>
          <a href="/browse" className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-ink-400 hover:text-onyx transition-colors">View all →</a>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-8 gap-4">
          {recent.map((m) => <MangaCard key={m.id} manga={m} />)}
        </div>
      </section>
    </div>
  )
}
