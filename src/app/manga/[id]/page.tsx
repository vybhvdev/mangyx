import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getMangaById, getMangaFeed, getCoverUrl, getTitle, getDescription, getScanlationGroup } from '@/lib/mangadex'
import { BookmarkButton } from '@/components/ui/BookmarkButton'
import { getServiceClient } from '@/lib/supabase'
import { fmtRelative } from '@/lib/utils'

interface Props {
  params: { id: string }
}

export default async function MangaPage({ params }: Props) {
  const [manga, { chapters, total }] = await Promise.all([
    getMangaById(params.id).catch(() => null),
    getMangaFeed(params.id, 40, 0),
  ])

  if (!manga) notFound()

  const session = await getServerSession(authOptions)
  const title = getTitle(manga)
  const desc = getDescription(manga)
  const cover = getCoverUrl(manga, '512')
  const tags = manga.attributes?.tags?.slice(0, 6) ?? []
  const status = manga.attributes?.status
  const year = manga.attributes?.year
  const lang = manga.attributes?.originalLanguage?.toUpperCase()

  // Check if bookmarked
  let isBookmarked = false
  if (session?.user?.id) {
    const db = getServiceClient()
    const { data } = await db
      .from('bookmarks')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('manga_id', manga.id)
      .single()
    isBookmarked = !!data
  }

  const firstChapter = chapters[chapters.length - 1]

  return (
    <div className="max-w-[1200px] mx-auto px-8 pb-16 animate-fade-up">

      {/* Detail grid */}
      <div className="grid grid-cols-[140px_1fr] md:grid-cols-[220px_1fr] gap-8 md:gap-12 py-12 border-b border-ink-200 mb-10">

        {/* Cover */}
        <div className="relative aspect-[3/4] overflow-hidden bg-ink-200">
          {cover && (
            <Image src={cover} alt={title} fill className="object-cover" priority sizes="220px" />
          )}
        </div>

        {/* Info */}
        <div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((t) => (
                <span key={t.id} className="tag">{t.attributes?.name?.en}</span>
              ))}
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

          <p className="font-cormorant text-[1.1rem] text-ink-700 leading-[1.65] max-w-[500px] mb-8">
            {desc || 'No description available.'}
          </p>

          <div className="flex gap-4 flex-wrap">
            {firstChapter ? (
              <Link href={`/reader/${firstChapter.id}?manga=${manga.id}`} className="btn-primary">
                Start Reading
              </Link>
            ) : (
              <button className="btn-primary opacity-50 cursor-not-allowed" disabled>No Chapters</button>
            )}
            <BookmarkButton
              mangaId={manga.id}
              mangaTitle={title}
              coverUrl={cover}
              mangaStatus={status ?? ''}
              initialBookmarked={isBookmarked}
            />
          </div>
        </div>
      </div>

      {/* Chapter list */}
      <div>
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-syne font-bold text-[1.2rem]">
            Chapters
            {total > 0 && <span className="font-mono text-[0.65rem] text-ink-400 ml-3 tracking-[0.1em]">{total} total</span>}
          </h2>
        </div>

        {chapters.length === 0 ? (
          <p className="label-mono py-8">No English chapters found.</p>
        ) : (
          <div>
            {chapters.map((ch) => {
              const chNum = ch.attributes.chapter
              const chTitle = ch.attributes.title
              const group = getScanlationGroup(ch)
              const date = ch.attributes.publishAt ?? ch.attributes.createdAt

              return (
                <Link
                  key={ch.id}
                  href={`/reader/${ch.id}?manga=${manga.id}`}
                  className="flex items-center justify-between px-2 py-3 border-b border-ink-100
                             hover:bg-ink-50 transition-colors -mx-2 no-underline group"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="font-syne text-[0.85rem] font-medium text-onyx">
                      Chapter {chNum}{chTitle ? ` — ${chTitle}` : ''}
                    </span>
                    {group && (
                      <span className="font-mono text-[0.6rem] text-ink-400">{group}</span>
                    )}
                  </div>
                  <span className="font-mono text-[0.65rem] text-ink-400 shrink-0 ml-4">
                    {fmtRelative(date)}
                  </span>
                </Link>
              )
            })}

            {total > 40 && (
              <p className="label-mono mt-6 text-center">
                Showing 40 of {total} chapters.{' '}
                <Link href={`/manga/${manga.id}/chapters`} className="text-onyx underline underline-offset-2">
                  View all
                </Link>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
