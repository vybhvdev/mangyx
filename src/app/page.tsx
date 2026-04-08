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
          <section className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden mb-12 group">
            <Image
              src={`/api/proxy?url=${encodeURIComponent(featured.coverUrl!)}`}
              alt={featured.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full max-w-2xl animate-fade-up">
              <span className="inline-block px-3 py-1 bg-accent/20 backdrop-blur-md border border-accent/30 rounded-full text-[10px] font-bold uppercase tracking-widest text-accent mb-4">
                Featured Today
              </span>
              <h1 className="font-syne font-black text-4xl md:text-6xl text-white mb-6 leading-[1.1] tracking-tight">
                {featured.title}
              </h1>
              <div className="flex gap-4">
                <Link href={`/manga/consumet/${encodeURIComponent(featured.id)}`} className="btn-primary">
                  Read Now
                </Link>
                <Link href={`/manga/consumet/${encodeURIComponent(featured.id)}`} className="btn-secondary bg-white/10 backdrop-blur-md border-white/10 text-white">
                  View Details
                </Link>
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
          <section key={section.title} className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-syne font-extrabold text-2xl tracking-tight">{section.title}</h2>
              <Link href={`/browse?q=${section.title.toLowerCase()}`} className="text-xs font-bold text-text-muted hover:text-accent tracking-widest uppercase transition-colors">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
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
        <section className="relative h-[450px] md:h-[550px] rounded-3xl overflow-hidden mb-12 group">
          {getCoverUrl(featured, '1200') && (
            <Image
              src={getCoverUrl(featured, '1200')!}
              alt={getTitle(featured)}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full max-w-3xl animate-fade-up">
            <span className="inline-block px-3 py-1 bg-accent/20 backdrop-blur-md border border-accent/30 rounded-full text-[10px] font-bold uppercase tracking-widest text-accent mb-4">
              Trending #1
            </span>
            <h1 className="font-syne font-black text-4xl md:text-7xl text-white mb-4 leading-[1.1] tracking-tight">
              {getTitle(featured)}
            </h1>
            <p className="text-white/70 text-sm md:text-base max-w-lg mb-8 line-clamp-2 md:line-clamp-3 leading-relaxed">
              {featured.attributes?.description?.en ?? ''}
            </p>
            <div className="flex gap-4">
              <Link href={`/manga/${featured.id}`} className="btn-primary">
                Start Reading
              </Link>
              <Link href={`/manga/${featured.id}`} className="btn-secondary bg-white/10 backdrop-blur-md border-white/10 text-white">
                Manga Info
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="mb-12">
        <div className="flex items-center justify-between mb-6 px-1">
          <h2 className="font-syne font-extrabold text-2xl tracking-tight">Popular Series</h2>
          <Link href="/browse" className="text-xs font-bold text-text-muted hover:text-accent tracking-widest uppercase transition-colors">
            Explore All
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {popular.slice(1).map((m) => <MangaCard key={m.id} manga={m} />)}
        </div>
      </section>

      <NativeBanner />

      <section className="mb-12">
        <div className="flex items-center justify-between mb-6 px-1">
          <h2 className="font-syne font-extrabold text-2xl tracking-tight">Recently Updated</h2>
          <Link href="/browse?sort=updated" className="text-xs font-bold text-text-muted hover:text-accent tracking-widest uppercase transition-colors">
            Full Feed
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-5">
          {recent.map((m) => <MangaCard key={m.id} manga={m} />)}
        </div>
      </section>

      {international.length > 0 && (
        <section className="mb-12 py-12 border-t border-white/5">
          <div className="flex items-center justify-between mb-2 px-1">
            <h2 className="font-syne font-extrabold text-2xl tracking-tight text-accent">Worldwide</h2>
            <Link href="/browse?lang=international" className="text-xs font-bold text-text-muted hover:text-accent tracking-widest uppercase transition-colors">
              Global Browse
            </Link>
          </div>
          <p className="text-text-muted text-sm mb-8 px-1">Discover trending titles in their original Japanese, Korean, and Chinese editions.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {international.map((m) => <MangaCard key={m.id} manga={m} showLangBadge />)}
          </div>
        </section>
      )}
    </div>
  )
}
