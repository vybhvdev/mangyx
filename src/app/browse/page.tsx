import { getMangaTags, searchManga as mdSearch, getInternationalManga } from '@/lib/mangadex'
import { BrowseClient } from './BrowseClient'
import { MangaCard } from '@/components/ui/MangaCard'

interface Props { searchParams: { q?: string; lang?: string } }

export default async function BrowsePage({ searchParams }: Props) {
  const q = searchParams.q ?? ''
  const lang = searchParams.lang ?? ''

  const tags = await getMangaTags()

  // International mode
  if (lang === 'international') {
    const manga = await getInternationalManga(48)
    return (
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-10">
        <div className="mb-8">
          <p className="font-mono text-[0.65rem] tracking-[0.25em] uppercase text-ink-400 mb-2">Browse</p>
          <h1 className="font-syne font-black text-[2.5rem] tracking-[-0.02em]">International</h1>
          <p className="font-cormorant text-[1rem] text-ink-500 mt-1">Popular titles in their original language</p>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-5">
          {manga.map((m) => <MangaCard key={m.id} manga={m} showLangBadge />)}
        </div>
      </div>
    )
  }

  // Language filter
  if (lang && lang !== 'en') {
    const manga = await mdSearch('', 24, lang)
    return (
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-10">
        <div className="mb-8">
          <p className="font-mono text-[0.65rem] tracking-[0.25em] uppercase text-ink-400 mb-2">Browse</p>
          <h1 className="font-syne font-black text-[2.5rem] tracking-[-0.02em] uppercase">{lang}</h1>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-5">
          {manga.map((m) => <MangaCard key={m.id} manga={m} showLangBadge />)}
        </div>
      </div>
    )
  }

  const manga = await mdSearch(q, 24)

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-10">
      <div className="mb-8">
        <p className="font-mono text-[0.65rem] tracking-[0.25em] uppercase text-ink-400 mb-2">Browse</p>
        <h1 className="font-syne font-black text-[2.5rem] tracking-[-0.02em]">
          {q ? `"${q}"` : 'All Manga'}
        </h1>
      </div>
      <BrowseClient tags={tags} />
      {manga.length === 0 ? (
        <p className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-ink-400 mt-12">No results found.</p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-5 mt-8">
          {manga.map((m) => <MangaCard key={m.id} manga={m} />)}
        </div>
      )}
    </div>
  )
}
