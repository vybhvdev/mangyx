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
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 33vw, 16vw"
          />
        )}
        {manga.source === 'consumet' && (
          <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded-lg text-[9px] font-bold uppercase tracking-wider text-white border border-white/10">
            External
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <h3 className="mt-3 font-semibold text-sm line-clamp-2 text-foreground group-hover:text-accent transition-colors duration-200">
        {manga.title}
      </h3>
    </Link>
  )
}
