import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getServiceClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
import {
  getMangaById, getMangaFeed, getMangaFeedInLang,
  getFirstChapter, getFirstChapterInLang,
  getRelatedManga, getCoverUrl, getTitle, getDescription, getScanlationGroup
} from '@/lib/mangadex'
import { BookmarkButton } from '@/components/ui/BookmarkButton'
import { MangaCard } from '@/components/ui/MangaCard'
import { fmtRelative } from '@/lib/utils'

interface Props {
  params: { id: string }
  searchParams: { page?: string }
}

const LANG_LABELS: Record<string, string> = {
  ja: 'Japanese', ko: 'Korean', zh: 'Chinese',
  fr: 'French', es: 'Spanish', de: 'German',
  pt: 'Portuguese', it: 'Italian', ru: 'Russian',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.id) || params.id.length > 10
  const manga = await getMangaById(params.id).catch(() => null)
  if (!manga) return { title: 'Manga Not Found — Mangyx' }
  const title = getTitle(manga)
  return { title: `${title} — Mangyx` }
}

export default async function MangaPage({ params, searchParams }: Props) {
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.id)
  if (!isUUID) redirect(`/manga/consumet/${encodeURIComponent(params.id)}`)

  const page = Math.max(1, parseInt(searchParams.page ?? '1'))
  const perPage = 50
  const offset = (page - 1) * perPage

  const manga = await getMangaById(params.id).catch(() => null)
  if (!manga) notFound()

  const origLang = manga.attributes?.originalLanguage ?? 'ja'
  const isEnglish = origLang === 'en'
  const session = await getServerSession(authOptions)

  const [enFeed, origFeed, progressRow] = await Promise.all([
    getMangaFeed(params.id, perPage, offset).catch(() => ({ chapters: [], total: 0 })),
    !isEnglish
      ? getMangaFeedInLang(params.id, origLang, perPage, offset).catch(() => ({ chapters: [], total: 0 }))
      : Promise.resolve({ chapters: [], total: 0 }),
    session?.user?.id
      ? getServiceClient()
          .from('reading_progress')
          .select('chapter_id, chapter_num')
          .eq('user_id', session.user.id)
          .eq('manga_id', params.id)
          .maybeSingle()
          .then(({ data }) => data)
          .catch(() => null)
      : Promise.resolve(null),
  ])

  const hasEnglish = enFeed.total > 0
  const activeFeed = hasEnglish ? enFeed : origFeed
  const { chapters, total } = activeFeed

  const firstChapter = hasEnglish
    ? await getFirstChapter(params.id).catch(() => null)
    : await getFirstChapterInLang(params.id, origLang).catch(() => null)

  const title = getTitle(manga)
  const desc = getDescription(manga)
  const cover = getCoverUrl(manga, '512')
  const tags = manga.attributes?.tags?.slice(0, 10) ?? []
  const status = manga.attributes?.status
  const year = manga.attributes?.year
  const totalPages = Math.ceil(total / perPage)

  const genreTagIds = manga.attributes?.tags
    ?.filter((t) => t.attributes.group === 'genre')
    ?.slice(0, 2)
    ?.map((t) => t.id) ?? []

  const related = await getRelatedManga(manga.id, genreTagIds, 6).catch(() => [])

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-16">
        <div className="flex flex-col md:grid md:grid-cols-[300px_1fr] gap-12 items-start animate-fade-up">
          {/* Cover Art */}
          <div className="relative w-full aspect-[3/4] rounded-none overflow-hidden border border-border shadow-xl bg-surface group">
            {cover && <Image src={cover} alt={title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" priority sizes="300px" />}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex flex-wrap gap-3 mb-6">
              {status && <span className="px-3 py-1 bg-accent text-background text-[9px] font-bold uppercase tracking-[0.2em]">{status}</span>}
              {year && <span className="px-3 py-1 border border-border text-text-muted text-[9px] font-bold uppercase tracking-[0.2em]">{year}</span>}
              <span className="px-3 py-1 border border-border text-text-muted text-[9px] font-bold uppercase tracking-[0.2em]">{origLang.toUpperCase()}</span>
            </div>

            <h1 className="font-syne font-black text-4xl md:text-7xl text-foreground mb-8 leading-[0.95] tracking-tight">
              {title}
            </h1>

            <p className="font-cormorant text-xl md:text-2xl text-foreground/80 leading-relaxed italic mb-8 max-w-2xl">
              {desc.slice(0, 300)}{desc.length > 300 ? '...' : ''}
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              {progressRow ? (
                <Link href={`/reader/${progressRow.chapter_id}?manga=${manga.id}`} className="btn-primary">
                  Continue Ch. {progressRow.chapter_num}
                </Link>
              ) : firstChapter ? (
                <Link href={`/reader/${firstChapter.id}?manga=${manga.id}`} className="btn-primary">
                  Start Reading
                </Link>
              ) : null}
              <BookmarkButton mangaId={manga.id} mangaTitle={title} coverUrl={cover} mangaStatus={status ?? ''} initialBookmarked={false} />
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <Link key={t.id} href={`/browse?tag=${t.id}`} className="chip">
                  {t.attributes?.name?.en}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-16 mt-20 pt-16 border-t border-border">
          {/* Chapters List */}
          <div>
            <div className="flex items-baseline justify-between mb-10">
              <h2 className="font-syne font-extrabold text-2xl tracking-tight uppercase">Chapters</h2>
              <span className="font-mono text-[10px] font-bold text-text-muted tracking-widest uppercase">{total} total</span>
            </div>

            <div className="grid gap-1">
              {chapters.length === 0 ? (
                <div className="p-12 text-center border border-dashed border-border">
                  <p className="text-text-muted font-bold text-[10px] uppercase tracking-widest">No chapters available</p>
                </div>
              ) : (
                chapters.map((ch) => {
                  const isCurrent = progressRow?.chapter_id === ch.id
                  return (
                    <Link key={ch.id} href={`/reader/${ch.id}?manga=${manga.id}`}
                      className={`group flex items-center justify-between p-4 border-b border-border transition-all hover:bg-surface ${isCurrent ? 'bg-surface' : ''}`}>
                      <div className="flex flex-col gap-1 min-w-0">
                        <span className={`font-bold text-sm truncate ${isCurrent ? 'text-accent' : 'text-foreground'}`}>
                          Chapter {ch.attributes.chapter}
                          {ch.attributes.title && <span className="font-medium opacity-50 ml-2">— {ch.attributes.title}</span>}
                        </span>
                        <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">
                          {getScanlationGroup(ch) || 'Unknown Group'}
                        </span>
                      </div>
                      <div className="flex items-center gap-6 shrink-0 ml-4">
                        {isCurrent && (
                          <span className="text-[9px] font-black uppercase tracking-widest text-accent">last read</span>
                        )}
                        <span className="text-[10px] font-medium text-text-muted font-mono">{fmtRelative(ch.attributes.publishAt)}</span>
                      </div>
                    </Link>
                  )
                })
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12">
                {page > 1 && (
                  <Link href={`/manga/${manga.id}?page=${page - 1}`} className="btn-secondary">Prev</Link>
                )}
                <div className="flex gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const p = page <= 3 ? i + 1 : page - 2 + i
                    if (p > totalPages) return null
                    return (
                      <Link key={p} href={`/manga/${manga.id}?page=${p}`}
                        className={`w-10 h-10 flex items-center justify-center font-bold text-[10px] transition-all border ${p === page ? 'bg-accent text-background border-accent' : 'border-border text-text-muted hover:text-foreground hover:border-accent'}`}>
                        {p}
                      </Link>
                    )
                  })}
                </div>
                {page < totalPages && (
                  <Link href={`/manga/${manga.id}?page=${page + 1}`} className="btn-secondary">Next</Link>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-12">
            <section>
              <h2 className="font-syne font-extrabold text-xl tracking-tight uppercase mb-8">Recommendations</h2>
              <div className="grid grid-cols-2 gap-4">
                {related.slice(0, 4).map((m) => (
                  <MangaCard key={m.id} manga={m} />
                ))}
              </div>
            </section>
            
            <section className="p-8 border border-border bg-surface/30">
              <h3 className="font-syne font-bold text-sm uppercase tracking-widest mb-4">Note</h3>
              <p className="font-cormorant text-base text-text-muted leading-relaxed">
                Translations are provided by various scanlation groups. If you enjoy the series, please consider supporting the official release.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}
