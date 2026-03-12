import { searchUnified } from '@/lib/manga'
import { getMangaTags } from '@/lib/mangadex'
import { BrowseClient } from './BrowseClient'
import { UnifiedMangaCard } from '@/components/ui/UnifiedMangaCard'

interface Props {
  searchParams: { q?: string; tag?: string }
}

export default async function BrowsePage({ searchParams }: Props) {
  const q = searchParams.q ?? ''

  const [results, tags] = await Promise.all([
    searchUnified(q),
    getMangaTags(),
  ])

  return (
    <div className="max-w-[1200px] mx-auto px-8 py-12">
      <h1 className="font-syne font-black text-[2.5rem] tracking-[-0.02em] mb-6">Browse</h1>
      <BrowseClient tags={tags} />
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
