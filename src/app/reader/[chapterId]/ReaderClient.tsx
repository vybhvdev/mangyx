'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface ChapterRef {
  id: string
  num: string
}

interface Props {
  pages: string[]
  chapterId: string
  mangaId: string
  chapters: ChapterRef[]
  currentIndex: number
}

export function ReaderClient({ pages, mangaId, chapters, currentIndex }: Props) {
  const router = useRouter()
  const [loaded, setLoaded] = useState(0)

  function navigate(dir: -1 | 1) {
    const next = chapters[currentIndex + dir]
    if (!next) return
    router.push(`/reader/${next.id}?manga=${mangaId}`)
  }

  const prevChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null
  const nextChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null
  const currentNum = chapters[currentIndex]?.num ?? '?'

  return (
    <div className="bg-onyx min-h-screen">

      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-[rgba(17,16,16,0.95)] border-b border-[#2a2a2a] flex items-center px-6 h-[52px] gap-4">
        <Link
          href={mangaId ? `/manga/${mangaId}` : '/'}
          className="font-mono text-[0.7rem] tracking-[0.1em] uppercase text-[#666] hover:text-paper transition-colors no-underline"
        >
          ← Back
        </Link>
        <span className="font-syne text-[0.8rem] font-semibold text-[#888]">
          Chapter {currentNum}
        </span>
        <span className="ml-auto font-mono text-[0.65rem] text-[#555] tracking-[0.1em]">
          {loaded}/{pages.length} pages
        </span>
      </div>

      {/* Pages */}
      <div className="flex flex-col items-center px-4 py-8 gap-0.5">
        {pages.map((src, i) => (
          <div key={i} className="relative w-full max-w-[720px]" style={{ aspectRatio: '0.7' }}>
            <Image
              src={src}
              alt={`Page ${i + 1}`}
              fill
              className="object-contain"
              sizes="720px"
              onLoad={() => setLoaded((n) => n + 1)}
              loading={i < 3 ? 'eager' : 'lazy'}
              priority={i < 2}
              unoptimized // MangaDex images don't need Next.js optimization
            />
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="sticky bottom-0 bg-[rgba(17,16,16,0.95)] border-t border-[#2a2a2a] flex items-center justify-between px-8 h-[52px]">
        <button
          onClick={() => navigate(1)}
          disabled={!prevChapter}
          className="flex items-center gap-1.5 font-syne text-[0.75rem] tracking-[0.1em] uppercase
                     text-[#666] hover:text-paper disabled:opacity-30 disabled:cursor-not-allowed
                     bg-transparent border-none cursor-pointer transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15,18 9,12 15,6"/>
          </svg>
          Prev Chapter
        </button>

        <Link
          href={mangaId ? `/manga/${mangaId}` : '/'}
          className="font-mono text-[0.6rem] tracking-[0.15em] uppercase text-[#444] hover:text-[#888] transition-colors no-underline"
        >
          Ch. list
        </Link>

        <button
          onClick={() => navigate(-1)}
          disabled={!nextChapter}
          className="flex items-center gap-1.5 font-syne text-[0.75rem] tracking-[0.1em] uppercase
                     text-[#666] hover:text-paper disabled:opacity-30 disabled:cursor-not-allowed
                     bg-transparent border-none cursor-pointer transition-colors"
        >
          Next Chapter
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9,18 15,12 9,6"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
