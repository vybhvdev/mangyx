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
    <Link href={`/manga/${manga.id}`} className="group block animate-fade-up">
      <div className="card-3-4">
        {cover ? (
          <Image
            src={cover}
            alt={title}
            fill
            sizes="(max-width: 768px) 33vw, (max-width: 1200px) 16vw, 200px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority={priority}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-syne font-bold text-2xl text-text-muted opacity-50 uppercase">
              {title.slice(0, 1)}
            </span>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-0 inset-x-0 flex justify-between items-start pointer-events-none">
          {status && (
            <span className="px-2 py-1 bg-accent text-background text-[8px] font-bold uppercase tracking-widest">
              {status}
            </span>
          )}
          {showLangBadge && manga.attributes?.originalLanguage && (
            <span className="px-2 py-1 bg-surface text-foreground text-[8px] font-bold uppercase tracking-widest ml-auto border-l border-b border-border">
              {manga.attributes.originalLanguage}
            </span>
          )}
        </div>
      </div>
      <h3 className="mt-4 font-syne font-bold text-xs uppercase tracking-tight leading-tight line-clamp-2 text-foreground group-hover:text-accent transition-colors duration-200">
        {title}
      </h3>
    </Link>
  )
}

export function MangaCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="card-3-4 skeleton" />
      <div className="h-3 mt-4 bg-surface w-4/5" />
      <div className="h-3 mt-2 bg-surface w-2/3 opacity-50" />
    </div>
  )
}
