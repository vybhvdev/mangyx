'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import type { MangaSource } from '@/lib/manga'
import { ReaderBannerAd } from '@/components/ui/ReaderBannerAd'

interface ChapterRef { id: string; num: string }

interface Props {
  pages: string[]
  pageHeaders: Record<string, string>[]
  chapterId: string
  mangaId: string
  mangaTitle: string
  coverUrl: string
  source: MangaSource
  chapters: ChapterRef[]
  currentIndex: number
}

export function ReaderClient({ pages, mangaId, mangaTitle, coverUrl, source, chapters, currentIndex, chapterId }: Props) {
  const router = useRouter()
  const [loaded, setLoaded] = useState(0)
  const [uiVisible, setUiVisible] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const { data: session } = useSession()
  const observerRef = useRef<IntersectionObserver | null>(null)

  const prevChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null
  const nextChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null
  const currentNum = chapters[currentIndex]?.num ?? '?'

  const proxied = pages.map((p) => `/api/proxy?url=${encodeURIComponent(p)}`)

  // Save reading progress after 3s
  useEffect(() => {
    if (!session?.user) return
    const timer = setTimeout(() => {
      fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mangaId,
          chapterId,
          chapterNum: currentNum,
          mangaTitle,
          coverUrl,
          source,
        }),
      })
    }, 3000)
    return () => clearTimeout(timer)
  }, [chapterId, session])

  function toggleUI() { setUiVisible(!uiVisible) }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  function navigate(dir: -1 | 1) {
    const next = chapters[currentIndex + dir]
    if (!next) return
    router.push(`/reader/${next.id}?manga=${mangaId}&source=${source}`)
  }

  const progress = Math.round((loaded / pages.length) * 100) || 0

  return (
    <div className="bg-black min-h-screen text-white overflow-x-hidden select-none">
      {/* Top Bar */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${uiVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="bg-background/90 backdrop-blur-xl border-b border-white/10 px-4 md:px-8 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={mangaId ? `/manga/${mangaId}${source === 'consumet' ? `?source=consumet` : ''}` : '/'}
              className="p-2 hover:bg-surface rounded-full transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </Link>
            <div className="hidden sm:block">
              <h2 className="text-sm font-bold truncate max-w-[200px] md:max-w-[400px]">{mangaTitle}</h2>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Chapter {currentNum}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden xs:block">
              <p className="text-xs font-bold font-mono">{loaded} / {pages.length}</p>
              <div className="w-24 h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-accent transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <button onClick={toggleFullscreen} className="p-2 hover:bg-surface rounded-full transition-colors">
              {isFullscreen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3"/></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tap Zones */}
      {!uiVisible && (
        <>
          <div className="fixed top-0 left-0 bottom-0 w-[25%] z-40 cursor-pointer" onClick={() => window.scrollTo({ top: window.scrollY - window.innerHeight * 0.8, behavior: 'smooth' })} />
          <div className="fixed top-0 right-0 bottom-0 w-[25%] z-40 cursor-pointer" onClick={() => window.scrollTo({ top: window.scrollY + window.innerHeight * 0.8, behavior: 'smooth' })} />
          <div className="fixed top-[20%] left-[25%] right-[25%] bottom-[20%] z-40 cursor-pointer" onClick={toggleUI} />
        </>
      )}

      {/* Pages Container */}
      <div className={`flex flex-col items-center pt-[64px] pb-[80px] transition-all duration-300 ${!uiVisible ? 'pt-0 pb-0' : ''}`} onClick={uiVisible ? toggleUI : undefined}>
        {pages.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 animate-fade-up">
            <div className="w-20 h-20 rounded-full bg-surface flex items-center justify-center text-accent">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01"/></svg>
            </div>
            <p className="text-sm font-bold uppercase tracking-widest text-text-muted">No pages available</p>
            <Link href={`/manga/${mangaId}`} className="btn-secondary">Back to Details</Link>
          </div>
        ) : (
          <div className="w-full max-w-[1000px] flex flex-col gap-1">
            {proxied.map((src, i) => (
              <div key={i} className="relative min-h-[400px] bg-surface/5 flex items-center justify-center overflow-hidden">
                <img
                  src={src}
                  alt={`Page ${i + 1}`}
                  className="w-full h-auto block transition-opacity duration-500"
                  loading={i < 3 ? 'eager' : 'lazy'}
                  onLoad={(e) => {
                    e.currentTarget.style.opacity = '1'
                    setLoaded((n) => Math.max(n, i + 1))
                  }}
                  style={{ opacity: 0 }}
                  onError={(e) => {
                    if (e.currentTarget.src !== pages[i]) e.currentTarget.src = pages[i]
                  }}
                />
                {i >= loaded && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <div className="w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Loading Page {i + 1}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Ad / Navigation */}
      <div className="max-w-[1000px] mx-auto px-4 py-12">
        <ReaderBannerAd />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12">
          {prevChapter ? (
            <button onClick={() => navigate(1)} className="btn-secondary h-20 flex flex-col items-center justify-center gap-1 group">
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted group-hover:text-accent">Previous</span>
              <span className="font-bold">Chapter {prevChapter.num}</span>
            </button>
          ) : <div className="h-20 bg-surface/20 rounded-2xl flex items-center justify-center text-text-muted text-[10px] font-bold uppercase tracking-widest border border-white/5 opacity-50">First Chapter</div>}
          
          {nextChapter ? (
            <button onClick={() => navigate(-1)} className="btn-primary h-20 flex flex-col items-center justify-center gap-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">Next</span>
              <span className="font-bold">Chapter {nextChapter.num}</span>
            </button>
          ) : <div className="h-20 bg-accent/10 rounded-2xl flex items-center justify-center text-accent text-[10px] font-bold uppercase tracking-widest border border-accent/20 opacity-50">End of Release</div>}
        </div>
      </div>

      {/* Floating Progress UI */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${uiVisible ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="bg-background/90 backdrop-blur-xl border-t border-white/10 px-6 py-4 flex items-center justify-center gap-8">
          <Link href={`/manga/${mangaId}`} className="text-text-muted hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
          </Link>
          <div className="flex-1 max-w-md h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-accent transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest w-12 text-right">{progress}%</span>
        </div>
      </div>
    </div>
  )
}
