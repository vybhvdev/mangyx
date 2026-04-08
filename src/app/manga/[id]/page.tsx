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
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        {cover && (
          <Image src={cover} alt="" fill className="object-cover blur-2xl opacity-30 scale-110" priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 md:px-8 w-full pb-12">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-end animate-fade-up">
              <div className="relative w-[180px] md:w-[240px] aspect-[3/4] shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                {cover && <Image src={cover} alt={title} fill className="object-cover" priority sizes="240px" />}
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                  {status && <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-[10px] font-bold uppercase tracking-widest border border-accent/20">{status}</span>}
                  {year && <span className="px-3 py-1 bg-white/5 text-white/60 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/5">{year}</span>}
                  <span className="px-3 py-1 bg-white/5 text-white/60 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/5">{origLang.toUpperCase()}</span>
                </div>
                <h1 className="font-syne font-black text-3xl md:text-6xl text-white mb-6 leading-tight tracking-tight">
                  {title}
                </h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  {progressRow ? (
                    <Link href={`/reader/${progressRow.chapter_id}?manga=${manga.id}`} className="btn-primary py-4 px-10">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                      Continue Ch. {progressRow.chapter_num}
                    </Link>
                  ) : firstChapter ? (
                    <Link href={`/reader/${firstChapter.id}?manga=${manga.id}`} className="btn-primary py-4 px-10">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 3l14 9-14 9V3z" fill="currentColor"/></svg>
                      Start Reading
                    </Link>
                  ) : null}
                  <BookmarkButton mangaId={manga.id} mangaTitle={title} coverUrl={cover} mangaStatus={status ?? ''} initialBookmarked={false} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12">
          {/* Main Content */}
          <div>
            <section className="mb-12">
              <h2 className="font-syne font-extrabold text-xl mb-4 tracking-tight">Synopsis</h2>
              <p className="text-text-muted leading-relaxed text-base whitespace-pre-wrap">
                {desc || 'No description available for this title.'}
              </p>
              <div className="flex flex-wrap gap-2 mt-6">
                {tags.map((t) => (
                  <Link key={t.id} href={`/browse?q=${t.attributes?.name?.en.toLowerCase()}`} className="chip">
                    {t.attributes?.name?.en}
                  </Link>
                ))}
              </div>
            </section>

            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-syne font-extrabold text-xl tracking-tight">
                  Chapters
                  <span className="ml-3 text-xs font-bold text-text-muted tracking-widest uppercase">{total} total</span>
                </h2>
                {!hasEnglish && !isEnglish && (
                  <span className="text-[10px] font-bold text-accent px-2 py-1 bg-accent-soft rounded-md uppercase tracking-wider">
                    {LANG_LABELS[origLang] ?? origLang}
                  </span>
                )}
              </div>

              <div className="grid gap-2">
                {chapters.length === 0 ? (
                  <div className="p-12 text-center bg-surface rounded-2xl border border-dashed border-border">
                    <p className="text-text-muted font-bold text-sm uppercase tracking-widest">No chapters available</p>
                  </div>
                ) : (
                  chapters.map((ch) => {
                    const isCurrent = progressRow?.chapter_id === ch.id
                    return (
                      <Link key={ch.id} href={`/reader/${ch.id}?manga=${manga.id}`}
                        className={`group flex items-center justify-between p-4 rounded-xl border border-white/5 transition-all hover:bg-surface hover:border-accent/30 ${isCurrent ? 'bg-accent-soft border-accent/20' : 'bg-surface/30'}`}>
                        <div className="flex flex-col gap-1 min-w-0">
                          <span className={`font-bold text-sm truncate ${isCurrent ? 'text-accent' : 'text-foreground group-hover:text-white'}`}>
                            Chapter {ch.attributes.chapter}
                            {ch.attributes.title && <span className="font-medium opacity-60 ml-2">— {ch.attributes.title}</span>}
                          </span>
                          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                            {getScanlationGroup(ch) || 'Unknown Group'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 shrink-0 ml-4">
                          {isCurrent && (
                            <span className="text-[9px] font-black uppercase tracking-widest text-accent">Last read</span>
                          )}
                          <span className="text-[11px] font-medium text-text-muted">{fmtRelative(ch.attributes.publishAt)}</span>
                          <svg className="text-text-muted group-hover:text-accent transition-colors" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                        </div>
                      </Link>
                    )
                  })
                )}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  {page > 1 && (
                    <Link href={`/manga/${manga.id}?page=${page - 1}`} className="btn-secondary px-6 py-2">Prev</Link>
                  )}
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const p = page <= 3 ? i + 1 : page - 2 + i
                      if (p > totalPages) return null
                      return (
                        <Link key={p} href={`/manga/${manga.id}?page=${p}`}
                          className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-xs transition-all ${p === page ? 'bg-accent text-white' : 'bg-surface text-text-muted hover:text-foreground'}`}>
                          {p}
                        </Link>
                      )
                    })}
                  </div>
                  {page < totalPages && (
                    <Link href={`/manga/${manga.id}?page=${page + 1}`} className="btn-secondary px-6 py-2">Next</Link>
                  )}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside>
            {related.length > 0 && (
              <div className="sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-syne font-extrabold text-xl tracking-tight">Recommendations</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {related.slice(0, 4).map((m) => (
                    <MangaCard key={m.id} manga={m} />
                  ))}
                </div>
                <Link href="/browse" className="btn-secondary w-full mt-6 py-3">
                  Explore More
                </Link>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}
