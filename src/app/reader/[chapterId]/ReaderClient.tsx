'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface ChapterRef { id: string; num: string }

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

  const proxied = pages.map((p) => `/api/proxy?url=${encodeURIComponent(p)}`)

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
      <div className="flex flex-col items-center gap-0.5">
        {pages.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <p className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-[#444]">
              No pages available
            </p>
            <Link
              href={mangaId ? `/manga/${mangaId}` : '/'}
              className="font-mono text-[0.7rem] text-[#666] uppercase tracking-[0.1em] hover:text-paper transition-colors no-underline"
            >
              ← Back to manga
            </Link>
          </div>
        ) : (
          proxied.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Page ${i + 1}`}
              className="w-full max-w-[720px] block"
              loading={i < 3 ? 'eager' : 'lazy'}
              onLoad={() => setLoaded((n) => n + 1)}
              onError={(e) => {
                // fallback to direct URL if proxy fails
                const direct = pages[i]
                if (e.currentTarget.src !== direct) e.currentTarget.src = direct
              }}
            />
          ))
        )}
      </div>

      {/* Bottom bar */}
      <div className="sticky bottom-0 bg-[rgba(17,16,16,0.95)] border-t border-[#2a2a2a] flex items-center justify-between px-8 h-[52px]">
        <button
          onClick={() => navigate(1)}
          disabled={!prevChapter}
          className="font-syne text-[0.75rem] tracking-[0.1em] uppercase text-[#666] hover:text-paper disabled:opacity-30 disabled:cursor-not-allowed transition-colors bg-transparent border-none cursor-pointer"
        >
          ← Prev
        </button>
        <Link
          href={mangaId ? `/manga/${mangaId}` : '/'}
          className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-[#555] hover:text-paper transition-colors no-underline"
        >
          Ch. List
        </Link>
        <button
          onClick={() => navigate(-1)}
          disabled={!nextChapter}
          className="font-syne text-[0.75rem] tracking-[0.1em] uppercase text-[#666] hover:text-paper disabled:opacity-30 disabled:cursor-not-allowed transition-colors bg-transparent border-none cursor-pointer"
        >
          Next →
        </button>
      </div>
    </div>
  )
}
