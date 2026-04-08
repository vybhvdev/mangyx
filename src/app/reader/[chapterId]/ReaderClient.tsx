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
    <div className="bg-[#111010] min-h-screen text-[#f5f2ec] overflow-x-hidden select-none">
      {/* Top Bar */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${uiVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="bg-[#111010]/95 backdrop-blur-xl border-b border-[#2a2a2a] px-4 md:px-8 h-[60px] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={mangaId ? `/manga/${mangaId}${source === 'consumet' ? `?source=consumet` : ''}` : '/'}
              className="p-2 hover:bg-white/5 rounded-none transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </Link>
            <div className="hidden sm:block">
              <h2 className="text-[11px] font-bold font-syne uppercase tracking-widest truncate max-w-[300px]">{mangaTitle}</h2>
              <p className="text-[9px] font-bold text-[#a89e8c] uppercase tracking-[0.2em]">Chapter {currentNum}</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right hidden xs:block">
              <p className="text-[10px] font-bold font-mono tracking-widest">{loaded} / {pages.length}</p>
              <div className="w-24 h-[1px] bg-white/10 mt-1 overflow-hidden">
                <div className="h-full bg-[#f5f2ec] transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <button onClick={toggleFullscreen} className="p-2 hover:bg-white/5 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Tap Zones */}
      {!uiVisible && (
        <>
          <div className="fixed top-0 left-0 bottom-0 w-[25%] z-40" onClick={() => window.scrollTo({ top: window.scrollY - window.innerHeight * 0.8, behavior: 'smooth' })} />
          <div className="fixed top-0 right-0 bottom-0 w-[25%] z-40" onClick={() => window.scrollTo({ top: window.scrollY + window.innerHeight * 0.8, behavior: 'smooth' })} />
          <div className="fixed inset-0 z-30" onClick={toggleUI} />
        </>
      )}

      {/* Pages */}
      <div className={`flex flex-col items-center pt-[60px] pb-[80px] transition-all duration-300 ${!uiVisible ? 'pt-0 pb-0' : ''}`} onClick={uiVisible ? toggleUI : undefined}>
        {pages.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 animate-fade-up">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#a89e8c]">No pages found</p>
            <Link href={`/manga/${mangaId}`} className="btn-secondary border-white/10 text-white hover:bg-white/5">Back to Details</Link>
          </div>
        ) : (
          <div className="w-full max-w-[900px] flex flex-col gap-1">
            {proxied.map((src, i) => (
              <div key={i} className="relative min-h-[400px] bg-white/5 flex items-center justify-center">
                <img
                  src={src}
                  alt={`Page ${i + 1}`}
                  className="w-full h-auto block transition-opacity duration-700"
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
                    <div className="w-6 h-6 border border-white/10 border-t-white rounded-full animate-spin" />
                    <span className="text-[9px] font-bold text-[#a89e8c] uppercase tracking-[0.2em]">Loading {i + 1}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="max-w-[900px] mx-auto px-4 py-20">
        <ReaderBannerAd />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-16">
          {prevChapter ? (
            <button onClick={() => navigate(1)} className="group border border-white/10 p-8 flex flex-col items-center gap-2 hover:bg-white/5 transition-all">
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#a89e8c]">Previous</span>
              <span className="font-syne font-bold text-sm tracking-widest uppercase">Chapter {prevChapter.num}</span>
            </button>
          ) : <div className="border border-white/5 p-8 flex items-center justify-center text-[9px] font-bold uppercase tracking-[0.3em] text-[#a89e8c] opacity-30">First Chapter</div>}
          
          {nextChapter ? (
            <button onClick={() => navigate(-1)} className="group bg-[#f5f2ec] text-[#111010] p-8 flex flex-col items-center gap-2 hover:opacity-90 transition-all">
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] opacity-60">Next Up</span>
              <span className="font-syne font-bold text-sm tracking-widest uppercase">Chapter {nextChapter.num}</span>
            </button>
          ) : <div className="border border-[#f5f2ec]/20 p-8 flex items-center justify-center text-[9px] font-bold uppercase tracking-[0.3em] text-[#f5f2ec] opacity-30">Latest Chapter</div>}
        </div>
      </div>

      {/* Progress Bar */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${uiVisible ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="bg-[#111010]/95 backdrop-blur-xl border-t border-[#2a2a2a] px-6 py-5 flex items-center justify-center gap-10">
          <Link href={`/manga/${mangaId}`} className="text-[#a89e8c] hover:text-white transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
          </Link>
          <div className="flex-1 max-w-lg h-[1px] bg-white/10 relative">
            <div className="absolute top-0 left-0 h-full bg-[#f5f2ec] transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-[10px] font-mono font-bold text-[#a89e8c] w-12 text-right">{progress}%</span>
        </div>
      </div>
    </div>
  )
}
