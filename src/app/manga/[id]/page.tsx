import Image from 'next/image'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getMangaById, getMangaFeed, getRelatedManga, getCoverUrl, getTitle, getDescription, getScanlationGroup } from '@/lib/mangadex'
import { BookmarkButton } from '@/components/ui/BookmarkButton'
import { MangaCard } from '@/components/ui/MangaCard'
import { fmtRelative } from '@/lib/utils'

interface Props { params: { id: string } }

export default async function MangaPage({ params }: Props) {
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.id)
  if (!isUUID) redirect(`/manga/consumet/${encodeURIComponent(params.id)}`)

  const [manga, { chapters, total }] = await Promise.all([
    getMangaById(params.id).catch(() => null),
    getMangaFeed(params.id, 40, 0).catch(() => ({ chapters: [], total: 0 })),
  ])

  if (!manga) notFound()

  const title = getTitle(manga)
  const desc = getDescription(manga)
  const cover = getCoverUrl(manga, '512')
  const tags = manga.attributes?.tags?.slice(0, 6) ?? []
  const status = manga.attributes?.status
  const year = manga.attributes?.year
  const lang = manga.attributes?.originalLanguage?.toUpperCase()

  const genreTagIds = manga.attributes?.tags
    ?.filter((t) => t.attributes.group === 'genre')
    ?.slice(0, 2)
    ?.map((t) => t.id) ?? []

  const genreNames = manga.attributes?.tags
    ?.filter((t) => t.attributes.group === 'genre')
    ?.slice(0, 2)
    ?.map((t) => t.attributes.name.en)
    ?.join(' & ') ?? 'Similar'

  const related = await getRelatedManga(manga.id, genreTagIds, 6).catch(() => [])
  const firstChapter = chapters[chapters.length - 1]

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-8 pb-16 animate-fade-up">

      {/* Hero — stacks on mobile, side-by-side on md+ */}
      <div className="flex flex-col md:grid md:grid-cols-[220px_1fr] gap-6 md:gap-12 py-8 md:py-12 border-b border-ink-200 mb-8">

        {/* Cover */}
        <div className="flex gap-5 md:block">
          <div className="relative w-[110px] md:w-full shrink-0 aspect-[3/4] overflow-hidden bg-ink-200">
            {cover && <Image src={cover} alt={title} fill className="object-cover" priority sizes="(max-width:768px) 110px, 220px" />}
          </div>

          {/* Mobile-only: title + meta beside cover */}
          <div className="flex flex-col justify-center md:hidden min-w-0">
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {tags.slice(0, 3).map((t) => (
                  <span key={t.id} className="tag text-[8px]">{t.attributes?.name?.en}</span>
                ))}
              </div>
            )}
            <h1 className="font-syne font-black text-[1.4rem] leading-[1.1] tracking-[-0.02em] text-onyx mb-2">
              {title}
            </h1>
            <div className="flex flex-wrap gap-3 font-mono text-[0.6rem] tracking-[0.12em] uppercase text-ink-400">
              {status && <span>{status}</span>}
              {year && <span>{year}</span>}
              {lang && <span>{lang}</span>}
              {total > 0 && <span>{total} ch</span>}
            </div>
          </div>
        </div>

        {/* Detail */}
        <div>
          {/* Desktop-only: tags + title + meta */}
          <div className="hidden md:block">
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map((t) => <span key={t.id} className="tag">{t.attributes?.name?.en}</span>)}
              </div>
            )}
            <h1 className="font-syne font-black text-[clamp(2rem,4vw,3.5rem)] leading-[1] tracking-[-0.02em] text-onyx mb-4">
              {title}
            </h1>
            <div className="flex gap-8 font-mono text-[0.7rem] tracking-[0.15em] uppercase text-ink-400 mb-6 flex-wrap">
              {status && <span>{status}</span>}
              {year && <span>{year}</span>}
              {lang && <span>{lang}</span>}
              {total > 0 && <span>{total} ch</span>}
            </div>
          </div>

          {/* Description */}
          <p className="font-cormorant text-[1.05rem] md:text-[1.1rem] text-ink-700 leading-[1.65] md:max-w-[500px] mb-6 mt-4 md:mt-0">
            {desc || 'No description available.'}
          </p>

          {/* Actions */}
          <div className="flex gap-3 flex-wrap">
            {firstChapter ? (
              <Link href={`/reader/${firstChapter.id}?manga=${manga.id}`} className="btn-primary">
                Start Reading
              </Link>
            ) : (
              <button className="btn-primary opacity-50 cursor-not-allowed" disabled>No Chapters</button>
            )}
            <BookmarkButton
              mangaId={manga.id} mangaTitle={title}
              coverUrl={cover} mangaStatus={status ?? ''}
              initialBookmarked={false}
            />
          </div>
        </div>
      </div>

      {/* Chapters */}
      <div className="mb-12">
        <h2 className="font-syne font-bold text-[1.1rem] md:text-[1.2rem] mb-4 md:mb-6">
          Chapters
          {total > 0 && (
            <span className="font-mono text-[0.65rem] text-ink-400 ml-3 tracking-[0.1em]">{total} total</span>
          )}
        </h2>
        {chapters.length === 0 ? (
          <p className="label-mono py-8">No English chapters found.</p>
        ) : (
          <div>
            {chapters.map((ch) => (
              <Link
                key={ch.id}
                href={`/reader/${ch.id}?manga=${manga.id}`}
                className="flex items-center justify-between px-2 py-3 border-b border-ink-100 hover:bg-ink-50 transition-colors -mx-2 no-underline"
              >
                <div className="flex flex-col gap-0.5 min-w-0 mr-3">
                  <span className="font-syne text-[0.82rem] font-medium text-onyx truncate">
                    Chapter {ch.attributes.chapter}
                    {ch.attributes.title ? ` — ${ch.attributes.title}` : ''}
                  </span>
                  {getScanlationGroup(ch) && (
                    <span className="font-mono text-[0.58rem] text-ink-400 truncate">{getScanlationGroup(ch)}</span>
                  )}
                </div>
                <span className="font-mono text-[0.62rem] text-ink-400 shrink-0">{fmtRelative(ch.attributes.publishAt)}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="pt-10 border-t border-ink-200">
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <h2 className="font-syne font-bold text-[1.1rem] md:text-[1.3rem] tracking-[-0.01em] text-onyx">More like this</h2>
              <p className="font-mono text-[0.62rem] tracking-[0.15em] uppercase text-ink-400 mt-0.5">{genreNames}</p>
            </div>
            <Link href="/browse" className="font-mono text-[0.62rem] tracking-[0.2em] uppercase text-ink-400 hover:text-onyx transition-colors no-underline">
              Browse all →
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-5">
            {related.map((m) => <MangaCard key={m.id} manga={m} />)}
          </div>
        </section>
      )}
    </div>
  )
}
