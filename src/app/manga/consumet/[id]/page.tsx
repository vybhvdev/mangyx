import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getMangaInfo } from '@/lib/consumet'

interface Props {
  params: { id: string }
  searchParams: { cover?: string }
}

export default async function ConsumetMangaPage({ params, searchParams }: Props) {
  const mangaId = decodeURIComponent(params.id)
  const manga = await getMangaInfo(mangaId).catch(() => null)
  if (!manga) notFound()

  const firstChapter = manga.chapters?.[manga.chapters.length - 1]
  const coverUrl = searchParams.cover
    ? `/api/proxy?url=${encodeURIComponent(searchParams.cover)}`
    : null

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative h-[450px] md:h-[550px] overflow-hidden">
        {coverUrl && (
          <Image src={coverUrl} alt="" fill className="object-cover blur-2xl opacity-30 scale-110" priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 md:px-8 w-full pb-12">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-end animate-fade-up">
              <div className="relative w-[180px] md:w-[240px] aspect-[3/4] shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-surface">
                {coverUrl ? (
                  <Image src={coverUrl} alt={manga.title ?? ''} fill className="object-cover" priority sizes="240px" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <span className="font-syne font-black text-4xl text-text-muted">{manga.title?.charAt(0)}</span>
                  </div>
                )}
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                  <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-[10px] font-bold uppercase tracking-widest border border-accent/20">External Source</span>
                  {manga.status && <span className="px-3 py-1 bg-white/5 text-white/60 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/5">{manga.status}</span>}
                </div>
                <h1 className="font-syne font-black text-3xl md:text-6xl text-white mb-6 leading-tight tracking-tight">
                  {manga.title}
                </h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  {firstChapter ? (
                    <Link href={`/reader/${encodeURIComponent(firstChapter.id)}?manga=${encodeURIComponent(mangaId)}&source=consumet`} className="btn-primary py-4 px-10">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 3l14 9-14 9V3z" fill="currentColor"/></svg>
                      Start Reading
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12 mt-12">
          <div>
            <section className="mb-12">
              <h2 className="font-syne font-extrabold text-xl mb-4 tracking-tight">Synopsis</h2>
              <p className="text-text-muted leading-relaxed text-base">
                {manga.description || 'No description available for this title.'}
              </p>
              {manga.genres && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {manga.genres.map((g) => (
                    <Link key={g} href={`/browse?q=${g.toLowerCase()}`} className="chip">
                      {g}
                    </Link>
                  ))}
                </div>
              )}
            </section>

            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-syne font-extrabold text-xl tracking-tight uppercase">
                  Chapters
                  <span className="ml-3 text-xs font-bold text-text-muted tracking-widest uppercase">{manga.chapters?.length ?? 0} total</span>
                </h2>
              </div>

              <div className="grid gap-2">
                {(!manga.chapters || manga.chapters.length === 0) ? (
                  <div className="p-12 text-center bg-surface rounded-2xl border border-dashed border-border">
                    <p className="text-text-muted font-bold text-sm uppercase tracking-widest">No chapters available</p>
                  </div>
                ) : (
                  manga.chapters.map((ch) => (
                    <Link key={ch.id} href={`/reader/${encodeURIComponent(ch.id)}?manga=${encodeURIComponent(mangaId)}&source=consumet`}
                      className="group flex items-center justify-between p-4 rounded-xl border border-white/5 transition-all hover:bg-surface hover:border-accent/30 bg-surface/30">
                      <div className="flex flex-col gap-1 min-w-0">
                        <span className="font-bold text-sm truncate group-hover:text-white transition-colors">
                          {ch.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 shrink-0 ml-4">
                        {ch.releaseDate && <span className="text-[11px] font-medium text-text-muted">{ch.releaseDate}</span>}
                        <svg className="text-text-muted group-hover:text-accent transition-colors" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
