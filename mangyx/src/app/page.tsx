import Image from 'next/image'
import Link from 'next/link'
import { MangaCard, MangaCardSkeleton } from '@/components/ui/MangaCard'
import { getPopularManga, getRecentlyUpdated, getCoverUrl, getTitle, getDescription } from '@/lib/mangadex'
import { Suspense } from 'react'

async function HeroSection() {
  const popular = await getPopularManga(1)
  const featured = popular[0]
  if (!featured) return null

  const title = getTitle(featured)
  const desc = getDescription(featured)
  const cover = getCoverUrl(featured, '512')

  return (
    <section className="py-16 border-b border-ink-200 mb-12 animate-fade-up">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-12 items-end">
        <div>
          <p className="label-mono mb-4">Featured Today</p>
          <h1 className="font-syne font-black text-[clamp(3rem,7vw,6rem)] leading-[0.95] tracking-[-0.02em] text-onyx mb-6 whitespace-pre-line">
            {title}
          </h1>
          <p className="font-cormorant text-[1.1rem] text-ink-600 leading-relaxed max-w-[460px] mb-8 line-clamp-3">
            {desc || 'No description available.'}
          </p>
          <div className="flex gap-4 items-center">
            <Link href={`/manga/${featured.id}`} className="btn-primary">Read Now</Link>
            <Link href={`/manga/${featured.id}`} className="btn-secondary">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
              Details
            </Link>
          </div>
        </div>
        {cover && (
          <div className="hidden md:block relative aspect-[3/4] overflow-hidden bg-ink-200">
            <Image src={cover} alt={title} fill className="object-cover" priority sizes="260px" />
          </div>
        )}
      </div>
    </section>
  )
}

async function PopularGrid() {
  const manga = await getPopularManga(12)
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-5">
      {manga.map((m, i) => <MangaCard key={m.id} manga={m} priority={i < 6} />)}
    </div>
  )
}

async function RecentGrid() {
  const manga = await getRecentlyUpdated(16)
  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
      {manga.map((m) => <MangaCard key={m.id} manga={m} />)}
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="max-w-[1200px] mx-auto px-8 pb-16">

      <Suspense fallback={
        <div className="py-16 border-b border-ink-200 mb-12">
          <div className="skeleton h-24 w-96 mb-6" />
          <div className="skeleton h-4 w-80 mb-4" />
          <div className="skeleton h-12 w-40" />
        </div>
      }>
        <HeroSection />
      </Suspense>

      <section className="mb-16 animate-fade-up-2">
        <div className="flex items-baseline justify-between mb-7">
          <h2 className="font-syne font-bold text-[1.3rem] tracking-[-0.01em] text-onyx">Popular</h2>
          <Link href="/browse" className="label-mono hover:text-onyx transition-colors no-underline">View all →</Link>
        </div>
        <Suspense fallback={
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-5">
            {Array.from({ length: 12 }).map((_, i) => <MangaCardSkeleton key={i} />)}
          </div>
        }>
          <PopularGrid />
        </Suspense>
      </section>

      <section className="mb-16 animate-fade-up-3">
        <div className="flex items-baseline justify-between mb-7">
          <h2 className="font-syne font-bold text-[1.3rem] tracking-[-0.01em] text-onyx">Recently Updated</h2>
          <Link href="/browse" className="label-mono hover:text-onyx transition-colors no-underline">View all →</Link>
        </div>
        <Suspense fallback={
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
            {Array.from({ length: 16 }).map((_, i) => <MangaCardSkeleton key={i} />)}
          </div>
        }>
          <RecentGrid />
        </Suspense>
      </section>

    </div>
  )
}
