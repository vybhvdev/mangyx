import { searchManga, getMangaTags } from '@/lib/mangadex'
import { MangaCard } from '@/components/ui/MangaCard'
import { BrowseClient } from './BrowseClient'

interface Props {
  searchParams: { q?: string; tag?: string }
}

export default async function BrowsePage({ searchParams }: Props) {
  const q = searchParams.q ?? ''
  const tagId = searchParams.tag ?? ''

  const [result, tags] = await Promise.all([
    searchManga(q, 24),
    getMangaTags(),
  ])

  const manga = Array.isArray(result) ? result : result.data

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
