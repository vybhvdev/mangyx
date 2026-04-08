import Image from 'next/image'
import Link from 'next/link'
import type { UnifiedManga } from '@/lib/manga'

interface Props { manga: UnifiedManga }

export function UnifiedMangaCard({ manga }: Props) {
  const basePath = manga.source === 'consumet'
    ? `/manga/consumet/${encodeURIComponent(manga.id)}`
    : `/manga/${manga.id}`

  const href = manga.source === 'consumet' && manga.coverUrl
    ? `${basePath}?cover=${encodeURIComponent(manga.coverUrl)}`
    : basePath

  const imgSrc = manga.source === 'consumet' && manga.coverUrl
    ? `/api/proxy?url=${encodeURIComponent(manga.coverUrl)}`
    : manga.coverUrl

  return (
    <Link href={href} className="group block animate-fade-up">
      <div className="card-3-4">
        {imgSrc && (
          <Image
            src={imgSrc}
            alt={manga.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 33vw, 16vw"
          />
        )}
        {manga.source === 'consumet' && (
          <span className="absolute top-0 left-0 px-2 py-1 bg-accent text-background text-[8px] font-bold uppercase tracking-widest">
            EXTERNAL
          </span>
        )}
      </div>
      <h3 className="mt-4 font-syne font-bold text-xs uppercase tracking-tight leading-tight line-clamp-2 text-foreground group-hover:text-accent transition-colors duration-200">
        {manga.title}
      </h3>
    </Link>
  )
}
