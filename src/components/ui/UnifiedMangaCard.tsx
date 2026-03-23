import Image from 'next/image'
import Link from 'next/link'
import type { UnifiedManga } from '@/lib/manga'

interface Props { manga: UnifiedManga }

export function UnifiedMangaCard({ manga }: Props) {
  const coverParam = manga.coverUrl ? `&cover=${encodeURIComponent(manga.coverUrl)}` : ''
  const href = manga.source === 'consumet'
    ? `/manga/consumet/${encodeURIComponent(manga.id)}${coverParam}`
    : `/manga/${manga.id}`

  const imgSrc = manga.source === 'consumet'
    ? `/api/proxy?url=${encodeURIComponent(manga.coverUrl)}`
    : manga.coverUrl

  return (
    <Link href={href} className="group cursor-pointer no-underline">
      <div className="relative aspect-[3/4] overflow-hidden bg-ink-200 mb-2">
        {imgSrc && (
          <Image
            src={imgSrc}
            alt={manga.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 33vw, 16vw"
          />
        )}
        {manga.source === 'consumet' && (
          <span className="absolute top-1.5 left-1.5 bg-paper/90 text-ink-700 font-mono text-[8px] tracking-[0.1em] uppercase px-1.5 py-0.5">
            Alt
          </span>
        )}
      </div>
      <p className="font-syne text-[0.78rem] font-semibold text-onyx leading-snug line-clamp-2 group-hover:text-ink-600 transition-colors">
        {manga.title}
      </p>
    </Link>
  )
}
