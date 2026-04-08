import { cookies } from 'next/headers'
import { getPopularManga, getRecentlyUpdated, getInternationalManga, getTitle, getCoverUrl } from '@/lib/mangadex'
import { searchManga as consumetSearch } from '@/lib/consumet'
import { MangaCard } from '@/components/ui/MangaCard'
import { NativeBanner } from '@/components/ui/NativeBanner'
import Image from 'next/image'
import Link from 'next/link'

export default async function HomePage() {
  const cookieStore = cookies()
  const provider = cookieStore.get('provider')?.value ?? 'mangadex'

  if (provider === 'mangapill') {
    const [shounen, action, romance, horror, comedy] = await Promise.all([
      consumetSearch('shounen').catch(() => []),
      consumetSearch('action').catch(() => []),
      consumetSearch('romance').catch(() => []),
      consumetSearch('horror').catch(() => []),
      consumetSearch('comedy').catch(() => []),
    ])
    const toCard = (items: typeof shounen) => items.map((m) => ({
      id: m.id, source: 'consumet' as const,
      title: m.title, coverUrl: m.image,
      description: '', status: '', tags: [],
    }))
    const { UnifiedMangaCard } = await import('@/components/ui/UnifiedMangaCard')
    const featured = toCard(shounen)[0]
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        {featured && (
          <section className="py-12 md:py-20 border-b border-border mb-16">
            <div className="flex flex-col md:grid md:grid-cols-[1fr_300px] gap-12 items-end">
              <div className="animate-fade-up">
                <span className="inline-block mb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-text-muted">Featured Selection</span>
                <h1 className="font-syne font-black text-5xl md:text-8xl text-foreground mb-8 leading-[0.9] tracking-tighter">
                  {featured.title}
                </h1>
                <div className="flex gap-4">
                  <Link href={`/manga/consumet/${encodeURIComponent(featured.id)}`} className="btn-primary">
                    Read Now
                  </Link>
                  <Link href={`/manga/consumet/${encodeURIComponent(featured.id)}`} className="btn-secondary">
                    Details
                  </Link>
                </div>
              </div>
              <div className="relative w-full aspect-[3/4] border border-border shadow-2xl bg-surface animate-fade-up" style={{ animationDelay: '0.1s' }}>
                <Image
                  src={`/api/proxy?url=${encodeURIComponent(featured.coverUrl!)}`}
                  alt={featured.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </section>
        )}

        {[
          { title: 'Action', data: action },
          { title: 'Romance', data: romance },
          { title: 'Horror', data: horror },
          { title: 'Comedy', data: comedy },
        ].map((section) => (
          <section key={section.title} className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-syne font-black text-2xl tracking-tight uppercase">{section.title}</h2>
              <Link href={`/browse?q=${section.title.toLowerCase()}`} className="text-[10px] font-bold text-text-muted hover:text-accent tracking-widest uppercase transition-colors">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
              {toCard(section.data).slice(0, 12).map((m) => (
                <UnifiedMangaCard key={m.id} manga={m} />
              ))}
            </div>
          </section>
        ))}
        <NativeBanner />
      </div>
    )
  }

  const [popular, recent, international] = await Promise.all([
    getPopularManga(13),
    getRecentlyUpdated(18),
    getInternationalManga(6),
  ])

  const featured = popular[0]

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
      {featured && (
        <section className="py-12 md:py-20 border-b border-border mb-16">
          <div className="flex flex-col md:grid md:grid-cols-[1fr_320px] gap-12 items-end">
            <div className="animate-fade-up">
              <span className="inline-block mb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-text-muted">Editor&apos;s Choice</span>
              <h1 className="font-syne font-black text-5xl md:text-8xl text-foreground mb-8 leading-[0.9] tracking-tighter">
                {getTitle(featured)}
              </h1>
              <p className="font-cormorant text-xl md:text-2xl text-foreground/70 leading-relaxed italic max-w-2xl mb-10">
                {featured.attributes?.description?.en?.slice(0, 180) ?? ''}...
              </p>
              <div className="flex gap-4">
                <Link href={`/manga/${featured.id}`} className="btn-primary">
                  Start Reading
                </Link>
                <Link href={`/manga/${featured.id}`} className="btn-secondary">
                  Information
                </Link>
              </div>
            </div>
            <div className="relative w-full aspect-[3/4] border border-border shadow-2xl bg-surface animate-fade-up" style={{ animationDelay: '0.1s' }}>
              {getCoverUrl(featured, '512') && (
                <Image
                  src={getCoverUrl(featured, '512')!}
                  alt={getTitle(featured)}
                  fill
                  className="object-cover"
                  priority
                />
              )}
            </div>
          </div>
        </section>
      )}

      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-syne font-black text-2xl tracking-tight uppercase">Popular Series</h2>
          <Link href="/browse" className="text-[10px] font-bold text-text-muted hover:text-accent tracking-widest uppercase transition-colors">
            Full Catalog →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
          {popular.slice(1).map((m) => <MangaCard key={m.id} manga={m} />)}
        </div>
      </section>

      <NativeBanner />

      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-syne font-black text-2xl tracking-tight uppercase">New Updates</h2>
          <Link href="/browse?sort=updated" className="text-[10px] font-bold text-text-muted hover:text-accent tracking-widest uppercase transition-colors">
            Full Feed →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6">
          {recent.map((m) => <MangaCard key={m.id} manga={m} />)}
        </div>
      </section>

      {international.length > 0 && (
        <section className="mb-16 pt-16 border-t border-border">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-syne font-black text-2xl tracking-tight uppercase">Worldwide</h2>
            <Link href="/browse?lang=international" className="text-[10px] font-bold text-text-muted hover:text-accent tracking-widest uppercase transition-colors">
              Global Browse →
            </Link>
          </div>
          <p className="font-cormorant text-lg text-text-muted italic mb-10">Popular titles in their original Japanese, Korean, and Chinese editions.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
            {international.map((m) => <MangaCard key={m.id} manga={m} showLangBadge />)}
          </div>
        </section>
      )}
    </div>
  )
}
