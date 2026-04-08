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

  const prevChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null
  const nextChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null
  const currentNum = chapters[currentIndex]?.num ?? '?'

  const proxied = pages.map((p) => `/api/proxy?url=${encodeURIComponent(p)}`)

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
      {/* Liquid Glass Top Bar */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ${uiVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="bg-background/60 backdrop-blur-2xl border-b border-white/5 px-4 md:px-8 h-[64px] flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-4">
            <Link
              href={mangaId ? `/manga/${mangaId}${source === 'consumet' ? `?source=consumet` : ''}` : '/'}
              className="p-2.5 hover:bg-white/10 rounded-full transition-all active:scale-90"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </Link>
            <div className="hidden sm:block">
              <h2 className="text-sm font-bold truncate max-w-[200px] md:max-w-[400px] tracking-tight">{mangaTitle}</h2>
              <p className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Chapter {currentNum}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden xs:block">
              <p className="text-[10px] font-black font-mono tracking-widest opacity-60">{loaded} / {pages.length}</p>
              <div className="w-24 h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-accent transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <button onClick={toggleFullscreen} className="p-2.5 hover:bg-white/10 rounded-full transition-all active:scale-90 text-white/80">
              {isFullscreen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3"/></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tap Zones */}
      {!uiVisible && (
        <>
          <div className="fixed top-0 left-0 bottom-0 w-[30%] z-40" onClick={() => window.scrollTo({ top: window.scrollY - window.innerHeight * 0.8, behavior: 'smooth' })} />
          <div className="fixed top-0 right-0 bottom-0 w-[30%] z-40" onClick={() => window.scrollTo({ top: window.scrollY + window.innerHeight * 0.8, behavior: 'smooth' })} />
          <div className="fixed inset-0 z-30" onClick={toggleUI} />
        </>
      )}

      {/* Pages Container */}
      <div className={`flex flex-col items-center pt-[64px] pb-[80px] transition-all duration-500 ease-in-out ${!uiVisible ? 'pt-0 pb-0' : ''}`} onClick={uiVisible ? toggleUI : undefined}>
        {pages.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8 animate-fade-up">
            <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center text-accent animate-pulse">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01"/></svg>
            </div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Transmission Error</p>
            <Link href={`/manga/${mangaId}`} className="btn-secondary px-12 border-white/10 hover:bg-white/5">Return to Base</Link>
          </div>
        ) : (
          <div className="w-full max-w-[1000px] flex flex-col gap-1.5 px-0 md:px-4">
            {proxied.map((src, i) => (
              <div key={i} className="relative min-h-[400px] bg-white/5 flex items-center justify-center group overflow-hidden">
                <img
                  src={src}
                  alt={`Page ${i + 1}`}
                  className="w-full h-auto block transition-all duration-700 ease-out"
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
                    <div className="w-10 h-10 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
                    <span className="text-[10px] font-black text-accent/40 uppercase tracking-[0.2em]">Buffering {i + 1}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation & Ads */}
      <div className="max-w-[1000px] mx-auto px-4 py-24">
        <ReaderBannerAd />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-20">
          {prevChapter ? (
            <button onClick={() => navigate(1)} className="group bg-surface/30 border border-white/5 p-10 rounded-[2.5rem] flex flex-col items-center gap-3 hover:bg-surface/50 transition-all active:scale-95">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 group-hover:text-accent transition-colors">Previous Data</span>
              <span className="font-syne font-black text-lg tracking-tight uppercase">Chapter {prevChapter.num}</span>
            </button>
          ) : <div className="bg-white/5 p-10 rounded-[2.5rem] flex items-center justify-center text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Initial Chapter</div>}
          
          {nextChapter ? (
            <button onClick={() => navigate(-1)} className="group bg-accent text-white p-10 rounded-[2.5rem] flex flex-col items-center gap-3 hover:scale-[1.02] shadow-2xl shadow-accent/20 transition-all active:scale-95">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70">Next Archive</span>
              <span className="font-syne font-black text-lg tracking-tight uppercase">Chapter {nextChapter.num}</span>
            </button>
          ) : <div className="bg-accent/10 border border-accent/20 p-10 rounded-[2.5rem] flex items-center justify-center text-[10px] font-black uppercase tracking-[0.3em] text-accent/40">Latest Release</div>}
        </div>
      </div>

      {/* Liquid Glass Bottom Nav */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-500 ${uiVisible ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="bg-background/60 backdrop-blur-2xl border-t border-white/5 px-6 py-6 flex items-center justify-between gap-10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
          <Link href={`/manga/${mangaId}`} className="p-3 text-white/40 hover:text-white transition-all active:scale-90">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
          </Link>
          <div className="flex-1 max-w-xl h-1.5 bg-white/10 rounded-full relative overflow-hidden">
            <div className="absolute top-0 left-0 h-full bg-accent shadow-[0_0_15px_rgba(244,63,94,0.5)] transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-[11px] font-black font-mono text-white/60 w-12 text-right">{progress}%</span>
        </div>
      </div>
    </div>
  )
}
