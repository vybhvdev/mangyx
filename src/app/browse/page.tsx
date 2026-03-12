import { MangaCard, MangaCardSkeleton } from '@/components/ui/MangaCard'
import { searchManga, getMangaTags } from '@/lib/mangadex'
import { Suspense } from 'react'
import { BrowseClient } from './BrowseClient'

interface Props {
  searchParams: { q?: string; tag?: string }
}

async function ResultGrid({ q, tagId }: { q: string; tagId: string }) {
  const { data, total } = await searchManga(q, 24, 0, tagId ? [tagId] : [])
  return (
    <>
      <p className="label-mono mb-6">
        {total.toLocaleString()} result{total !== 1 ? 's' : ''}{q ? ` for "${q}"` : ''}
      </p>
      {data.length === 0 ? (
        <p className="label-mono py-12 text-center">No results found.</p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
          {data.map((m) => <MangaCard key={m.id} manga={m} />)}
        </div>
      )}
    </>
  )
}

async function TagsLoader() {
  const tags = await getMangaTags()
  return <BrowseClient tags={tags} />
}

export default function BrowsePage({ searchParams }: Props) {
  const q = searchParams.q ?? ''
  const tagId = searchParams.tag ?? ''

  return (
    <div className="max-w-[1200px] mx-auto px-8 py-12 pb-16">
      <h1 className="font-syne font-black text-[2.5rem] tracking-[-0.02em] mb-6">Browse</h1>

      <Suspense fallback={
        <div className="flex gap-2 mb-8 flex-wrap">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton h-7 w-20" />
          ))}
        </div>
      }>
        <TagsLoader />
      </Suspense>

      <Suspense key={`${q}-${tagId}`} fallback={
        <>
          <div className="skeleton h-4 w-32 mb-6" />
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
            {Array.from({ length: 12 }).map((_, i) => <MangaCardSkeleton key={i} />)}
          </div>
        </>
      }>
        <ResultGrid q={q} tagId={tagId} />
      </Suspense>
    </div>
  )
}
