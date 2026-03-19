import Link from 'next/link'
import Image from 'next/image'
import type { Manga } from '@/types'
import { getCoverUrl, getTitle } from '@/lib/mangadex'

interface Props {
  manga: Manga
  priority?: boolean
  showLangBadge?: boolean
}

export function MangaCard({ manga, priority = false, showLangBadge = false }: Props) {
  const title = getTitle(manga)
  const cover = getCoverUrl(manga, '256')
  const status = manga.attributes?.status

  return (
    <Link href={`/manga/${manga.id}`} className="group cursor-pointer no-underline">
      <div className="relative overflow-hidden bg-ink-200 aspect-[3/4]">
        {cover ? (
          <Image
            src={cover}
            alt={title}
            fill
            sizes="(max-width: 768px) 33vw, (max-width: 1200px) 16vw, 200px"
            className="object-cover transition-transform duration-400 ease-out group-hover:scale-[1.04]"
            priority={priority}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-ink-200">
            <span className="font-syne font-black text-[1.5rem] text-ink-400 text-center px-2 leading-tight">
              {title.slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}
        {showLangBadge && manga.attributes?.originalLanguage && (
          <span className="absolute top-1.5 right-1.5 bg-onyx text-paper font-mono text-[8px] tracking-[0.1em] uppercase px-1.5 py-0.5 z-10">
            {manga.attributes.originalLanguage}
          </span>
        )}
        {status && (
          <span className="absolute top-1.5 left-1.5 bg-paper/90 text-ink-700 font-mono text-[9px] tracking-[0.15em] uppercase px-1.5 py-0.5">
            {status}
          </span>
        )}
      </div>
      <p className="card-title group-hover:text-ink-600">{title}</p>
    </Link>
  )
}

export function MangaCardSkeleton() {
  return (
    <div>
      <div className="skeleton aspect-[3/4]" />
      <div className="skeleton h-3.5 mt-2 w-4/5" />
    </div>
  )
}
