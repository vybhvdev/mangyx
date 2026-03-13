import { cookies } from 'next/headers'
import { getPopularManga, getRecentlyUpdated, getInternationalManga, getTitle, getCoverUrl } from '@/lib/mangadex'
import { searchManga as consumetSearch } from '@/lib/consumet'
import { cookies } from 'next/headers'
import { MangaCard } from '@/components/ui/MangaCard'
import Image from 'next/image'
import Link from 'next/link'

export default async function HomePage() {
  // provider cookie
  const cookieStore = cookies()
  const provider = cookieStore.get('provider')?.value ?? 'mangadex'

  if (provider === 'mangapill') {
    const [popular, recent] = await Promise.all([
      consumetSearch('popular manga').catch(() => []),
      consumetSearch('action manga').catch(() => []),
    ])
    const toCard = (results: typeof popular) => results.slice(0, 12).map((m) => ({
      id: m.id, source: 'consumet' as const,
      title: m.title, coverUrl: m.image,
      description: '', status: '', tags: [],
    }))
    const { UnifiedMangaCard } = await import('@/components/ui/UnifiedMangaCard')
    return (
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <section className="py-10 border-b border-ink-200 mb-10">
          <p className="font-mono text-[0.65rem] tracking-[0.25em] uppercase text-ink-400 mb-3">Mangapill</p>
          <h1 className="font-syne font-black text-[clamp(2.2rem,7vw,6rem)] leading-[0.95] tracking-[-0.02em] text-onyx mb-4">Read Manga</h1>
          <p className="font-cormorant text-[1.05rem] text-ink-600 max-w-md">Wide selection from Mangapill.</p>
        </section>
        <section className="mb-10">
          <h2 className="font-syne font-bold text-[1.2rem] mb-5">Popular</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-5">
            {toCard(popular).map((m) => <UnifiedMangaCard key={m.id} manga={m} />)}
          </div>
        </section>
        <section className="mb-10">
          <h2 className="font-syne font-bold text-[1.2rem] mb-5">Action</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-5">
            {toCard(recent).map((m) => <UnifiedMangaCard key={m.id} manga={m} />)}
          </div>
        </section>
      </div>
    )
  }

  const [popular, recent, international] = await Promise.all([
    getPopularManga(12),
    getRecentlyUpdated(16),
    getInternationalManga(6),
  ])

  const featured = popular[0]

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-8">

      {/* Hero */}
      {featured && (
        <section className="py-10 md:py-12 border-b border-ink-200 mb-10">
          <div className="flex gap-5 md:grid md:grid-cols-[1fr_200px] md:gap-10 items-start md:items-end">
            <div className="flex-1 min-w-0">
              <p className="font-mono text-[0.65rem] tracking-[0.25em] uppercase text-ink-400 mb-3">Featured Today</p>
              <h1 className="font-syne font-black text-[clamp(2.2rem,7vw,6rem)] leading-[0.95] tracking-[-0.02em] text-onyx mb-4">
                {getTitle(featured)}
              </h1>
              <p className="font-cormorant text-[1.05rem] text-ink-600 leading-relaxed max-w-md mb-6 line-clamp-3">
                {featured.attributes?.description?.en ?? ''}
              </p>
              <div className="flex gap-3 flex-wrap">
                <a href={`/manga/${featured.id}`} className="btn-primary">Read Now</a>
                <a href={`/manga/${featured.id}`} className="btn-secondary">Details</a>
              </div>
            </div>
            <div className="relative w-[90px] md:w-full shrink-0 aspect-[3/4] overflow-hidden bg-ink-200">
              {getCoverUrl(featured, '256') && (
                <Image src={getCoverUrl(featured, '256')!} alt={getTitle(featured)} fill className="object-cover" priority sizes="200px" />
              )}
            </div>
          </div>
        </section>
      )}

      {/* Popular */}
      <section className="mb-10">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="font-syne font-bold text-[1.2rem]">Popular</h2>
          <a href="/browse" className="font-mono text-[0.62rem] tracking-[0.2em] uppercase text-ink-400 hover:text-onyx transition-colors">View all →</a>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-5">
          {popular.slice(1).map((m) => <MangaCard key={m.id} manga={m} />)}
        </div>
      </section>

      {/* Recently Updated */}
      <section className="mb-10">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="font-syne font-bold text-[1.2rem]">Recently Updated</h2>
          <a href="/browse" className="font-mono text-[0.62rem] tracking-[0.2em] uppercase text-ink-400 hover:text-onyx transition-colors">View all →</a>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-8 gap-3 md:gap-4">
          {recent.map((m) => <MangaCard key={m.id} manga={m} />)}
        </div>
      </section>

      {/* International */}
      {international.length > 0 && (
        <section className="mb-10 pt-8 border-t border-ink-200">
          <div className="flex items-baseline justify-between mb-2">
            <h2 className="font-syne font-bold text-[1.2rem]">International</h2>
            <a href="/browse?lang=international" className="font-mono text-[0.62rem] tracking-[0.2em] uppercase text-ink-400 hover:text-onyx transition-colors">View all →</a>
          </div>
          <p className="font-cormorant text-[0.95rem] text-ink-500 mb-5">Popular titles in their original language</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-5">
            {international.map((m) => <MangaCard key={m.id} manga={m} showLangBadge />)}
          </div>
        </section>
      )}

    </div>
  )
}
