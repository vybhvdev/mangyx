import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getMangaInfo } from '@/lib/consumet'

interface Props { params: { id: string } }

export default async function ConsumetMangaPage({ params }: Props) {
  const mangaId = decodeURIComponent(params.id)
  const manga = await getMangaInfo(mangaId).catch(() => null)
  if (!manga) notFound()

  const coverSrc = manga.image ? `/api/proxy?url=${encodeURIComponent(manga.image)}` : ''
  const firstChapter = manga.chapters?.[manga.chapters.length - 1]

  return (
    <div className="max-w-[1200px] mx-auto px-8 pb-16 animate-fade-up">
      <div className="grid grid-cols-[140px_1fr] md:grid-cols-[220px_1fr] gap-8 md:gap-12 py-12 border-b border-ink-200 mb-10">
        <div className="relative aspect-[3/4] overflow-hidden bg-ink-200">
          {coverSrc && (
            <Image src={coverSrc} alt={manga.title} fill className="object-cover" priority sizes="220px" />
          )}
        </div>
        <div>
          {manga.genres && manga.genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {manga.genres.slice(0, 6).map((g) => (
                <span key={g} className="tag">{g}</span>
              ))}
            </div>
          )}
          <h1 className="font-syne font-black text-[clamp(2rem,4vw,3.5rem)] leading-[1] tracking-[-0.02em] text-onyx mb-4">
            {manga.title}
          </h1>
          <div className="flex gap-8 font-mono text-[0.7rem] tracking-[0.15em] uppercase text-ink-400 mb-6">
            {manga.status && <span>{manga.status}</span>}
            <span>{manga.chapters?.length ?? 0} ch</span>
          </div>
          {manga.description && (
            <p className="font-cormorant text-[1.1rem] text-ink-700 leading-[1.65] max-w-[500px] mb-8">
              {manga.description}
            </p>
          )}
          <div className="flex gap-4">
            {firstChapter ? (
              <Link
                href={`/reader/${encodeURIComponent(firstChapter.id)}?manga=${encodeURIComponent(mangaId)}&source=consumet`}
                className="btn-primary"
              >
                Start Reading
              </Link>
            ) : (
              <button className="btn-primary opacity-50 cursor-not-allowed" disabled>No Chapters</button>
            )}
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-syne font-bold text-[1.2rem] mb-6">
          Chapters
          <span className="font-mono text-[0.65rem] text-ink-400 ml-3 tracking-[0.1em]">
            {manga.chapters?.length ?? 0} total
          </span>
        </h2>
        {(manga.chapters ?? []).map((ch) => (
          <Link
            key={ch.id}
            href={`/reader/${encodeURIComponent(ch.id)}?manga=${encodeURIComponent(mangaId)}&source=consumet`}
            className="flex items-center justify-between px-2 py-3 border-b border-ink-100 hover:bg-ink-50 transition-colors -mx-2 no-underline"
          >
            <span className="font-syne text-[0.85rem] font-medium text-onyx">{ch.title}</span>
            {ch.releaseDate && (
              <span className="font-mono text-[0.65rem] text-ink-400 shrink-0 ml-4">{ch.releaseDate}</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
